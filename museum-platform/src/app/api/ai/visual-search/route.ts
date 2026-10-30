import { ArtifactStatus, Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const requestSchema = z.object({
  image: z.string().max(7_000_000),
});

const resultSchema = z.object({
  summary: z.string().min(1).max(500),
  matches: z.array(z.object({
    code: z.string().min(1),
    reason: z.string().min(1).max(300),
    score: z.number().int().min(0).max(100),
  })).max(3),
});

export async function POST(request: Request) {
  const { user, response } = await requireRole(Role.ADMIN, Role.STAFF, Role.CUSTOMER);
  if (response) return response;
  if (!user) return Response.json({ error: "Unauthenticated" }, { status: 401 });

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "Chức năng nhận diện ảnh chưa được cấu hình OPENAI_API_KEY." }, { status: 503 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Ảnh không hợp lệ hoặc quá lớn (tối đa 5 MB)." }, { status: 400 });
  const image = parsed.data.image;
  const imageMatch = image.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!imageMatch) return Response.json({ error: "Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP." }, { status: 400 });
  const imageBytes = Buffer.from(imageMatch[2], "base64");
  if (!imageBytes.length || imageBytes.length > 5 * 1024 * 1024) {
    return Response.json({ error: "Ảnh cần có dung lượng dưới 5 MB." }, { status: 413 });
  }

  try {
    const artifacts = await prisma.artifact.findMany({
      where: { status: { in: [ArtifactStatus.APPROVED, ArtifactStatus.ON_DISPLAY, ArtifactStatus.CONSERVATION, ArtifactStatus.RESEARCH] } },
      orderBy: { updatedAt: "desc" },
      take: 100,
      select: { code: true, name: true, period: true, year: true, category: true, description: true, status: true, imageUrl: true },
    });
    if (!artifacts.length) return Response.json({ error: "Bộ sưu tập chưa có hiện vật đã được duyệt để đối chiếu." }, { status: 404 });

    const catalog = artifacts.map(({ code, name, period, year, category, description }) => ({ code, name, period, year, category, description }));
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        temperature: 0.1,
        max_tokens: 900,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Bạn là trợ lý tìm kiếm hiện vật bảo tàng. Hãy xem ảnh người dùng gửi, mô tả ngắn các đặc điểm quan sát được rồi chọn tối đa 3 hồ sơ trong danh mục có vẻ phù hợp nhất. Chỉ dùng mã code có trong danh mục; không suy đoán ảnh chụp là hiện vật gốc hay xác thực niên đại. Nếu không thấy hồ sơ phù hợp, trả matches là mảng rỗng. Trả JSON đúng dạng {\"summary\": string, \"matches\": [{\"code\": string, \"reason\": string, \"score\": number}]} trong đó score là mức phù hợp tương đối 0-100, không phải xác suất xác thực." },
          { role: "user", content: [
            { type: "text", text: `Đối chiếu ảnh với danh mục hiện vật sau. Chỉ đề xuất khi có dấu hiệu hình ảnh hoặc mô tả đủ liên quan.\n${JSON.stringify(catalog)}` },
            { type: "image_url", image_url: { url: image, detail: "low" } },
          ] },
        ],
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!upstream.ok) {
      if (upstream.status === 401 || upstream.status === 403) {
        return Response.json({ error: "OPENAI_API_KEY không hợp lệ hoặc chưa được cấp quyền dùng mô hình." }, { status: 503 });
      }
      return Response.json({ error: "Dịch vụ nhận diện ảnh hiện không phản hồi. Vui lòng thử lại." }, { status: 502 });
    }

    const payload = await upstream.json();
    const content = payload.choices?.[0]?.message?.content;
    let decoded: unknown;
    try { decoded = JSON.parse(content); } catch { decoded = null; }
    const result = resultSchema.safeParse(decoded);
    if (!result.success) return Response.json({ error: "AI chưa trả về kết quả nhận diện hợp lệ. Vui lòng thử ảnh khác." }, { status: 502 });

    const byCode = new Map(artifacts.map((artifact) => [artifact.code, artifact]));
    const matches = result.data.matches.flatMap((match) => {
      const artifact = byCode.get(match.code);
      return artifact ? [{ artifact, reason: match.reason, score: match.score }] : [];
    });
    return Response.json({ summary: result.data.summary, matches });
  } catch {
    return Response.json({ error: "Không thể phân tích ảnh lúc này. Vui lòng thử lại sau." }, { status: 503 });
  }
}
