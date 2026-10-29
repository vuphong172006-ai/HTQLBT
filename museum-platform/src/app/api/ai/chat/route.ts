import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const questionSchema = z.object({ message: z.string().trim().min(1).max(1200), sessionId: z.string().max(100).optional() });

function localAnswer(question: string, context: string, facts: { exhibitions: string[]; todayVisitors: number; monthVisitors: number; ticketPriceVnd: number; openingTime: string; closingTime: string }) {
  const normalized = question.toLocaleLowerCase("vi-VN");
  if (/giờ mở cửa|mấy giờ|mở cửa|đóng cửa|thời gian hoạt động/.test(normalized)) return `Theo cấu hình hiện tại, bảo tàng mở cửa từ ${facts.openingTime} đến ${facts.closingTime}. Lịch ngày lễ có thể thay đổi; vui lòng kiểm tra thông báo trước chuyến đi.`;
  if (/địa chỉ|ở đâu|đường nào|vị trí/.test(normalized)) return "Bản demo chưa cấu hình địa chỉ và bản đồ chỉ đường chính thức. Bạn có thể xem sơ đồ các khu trưng bày trong mục “Bản đồ”; hãy xác nhận địa chỉ trên kênh chính thức của bảo tàng trước khi khởi hành.";
  if (/giá vé|bao nhiêu tiền|phí vào cửa|vé bao nhiêu/.test(normalized)) return `Giá vé tiêu chuẩn hiện được cấu hình là ${facts.ticketPriceVnd.toLocaleString("vi-VN")}₫/người.`;
  if (/đặt vé|mua vé|vé online|vé trực tuyến/.test(normalized)) return "Bạn có thể mở mục “Vé tham quan”, chọn ngày, khung giờ và số lượng khách rồi tiếp tục thanh toán qua VNPay sandbox. Vé chỉ có hiệu lực sau khi VNPay xác nhận qua IPN; cần cấu hình merchant keys trong .env.";
  if (/trẻ em|trẻ nhỏ|em bé|miễn phí/.test(normalized)) return "Chính sách giá vé trẻ em và miễn phí chưa được cấu hình trong bản demo. Hãy hỏi quầy vé để xác nhận độ tuổi áp dụng và giấy tờ cần mang theo.";
  if (/hiện vật|hiện vật nào|bộ sưu tập|mã hiện vật/.test(normalized)) return `Thông tin bộ sưu tập hiện có:\n${context || "Chưa có hồ sơ hiện vật trong cơ sở dữ liệu."}`;
  if (/triển lãm/.test(normalized)) return facts.exhibitions.length ? `Triển lãm đang hoạt động: ${facts.exhibitions.join("; ")}.` : "Hiện chưa có triển lãm đang hoạt động trong cơ sở dữ liệu.";
  if (/khách|lượt|tham quan|đông/.test(normalized)) return `Cơ sở dữ liệu ghi nhận ${facts.todayVisitors.toLocaleString("vi-VN")} lượt khách hôm nay và ${facts.monthVisitors.toLocaleString("vi-VN")} lượt trong 30 ngày gần nhất.`;
  if (/vé|đặt vé|giá/.test(normalized)) return "Bạn có thể đặt vé trong mục Vé tham quan với giá sandbox 80.000đ/người và thanh toán qua VNPay. Vé chỉ có hiệu lực sau khi IPN xác nhận; production cần merchant credentials và cấu hình endpoint production riêng.";
  return `Tôi đã tra cứu dữ liệu bảo tàng nhưng chưa tìm thấy câu trả lời cụ thể. Bạn có thể hỏi về hiện vật, triển lãm, lượng khách hoặc vé.\n\n${context ? `Một số hồ sơ hiện vật liên quan:\n${context}` : ""}`;
}

export async function POST(request: Request) {
  const { user, response } = await requireRole(Role.ADMIN, Role.STAFF, Role.CUSTOMER);
  if (response) return response;
  if (!user) return Response.json({ error: "Unauthenticated" }, { status: 401 });
  const parsed = questionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Nhập câu hỏi dài tối đa 1.200 ký tự." }, { status: 400 });
  const sessionId = parsed.data.sessionId || crypto.randomUUID();

  try {
    const keywords = [...new Set(parsed.data.message.toLocaleLowerCase("vi-VN").match(/[\p{L}\p{N}-]{3,}/gu) || [])].slice(0, 8);
    const matches = await prisma.artifact.findMany({
      where: { status: { in: ["APPROVED", "ON_DISPLAY", "CONSERVATION", "RESEARCH"] }, OR: [
        ...keywords.map((keyword) => ({ name: { contains: keyword, mode: "insensitive" as const } })),
        ...keywords.map((keyword) => ({ category: { contains: keyword, mode: "insensitive" as const } })),
        ...keywords.map((keyword) => ({ period: { contains: keyword, mode: "insensitive" as const } })),
      ] },
      take: 5,
      select: { code: true, name: true, period: true, year: true, category: true, status: true, description: true },
    });
    const context = matches.map((item) => `${item.name} (${item.code}) — ${item.category}, ${item.period}, ${item.year}; ${item.status}. ${item.description}`).join("\n");
    const now = new Date();
    const today = new Date(now); today.setHours(0, 0, 0, 0);
    const monthStart = new Date(now); monthStart.setDate(now.getDate() - 30);
    const [exhibitions, todayVisitors, monthVisitors, settings] = await Promise.all([
      prisma.exhibition.findMany({ where: { active: true, startsAt: { lte: now }, endsAt: { gte: now } }, select: { name: true, location: true, startsAt: true, endsAt: true } }),
      prisma.visitorVisit.count({ where: { visitedAt: { gte: today } } }),
      prisma.visitorVisit.count({ where: { visitedAt: { gte: monthStart } } }),
      prisma.museumSettings.findUnique({ where: { id: "museum" } }),
    ]);
    const facts = { exhibitions: exhibitions.map((item) => `${item.name} tại ${item.location} (${item.startsAt.toLocaleDateString("vi-VN")}–${item.endsAt.toLocaleDateString("vi-VN")})`), todayVisitors, monthVisitors, ticketPriceVnd: settings?.ticketPriceVnd ?? 0, openingTime: settings?.openingTime ?? "chưa cấu hình", closingTime: settings?.closingTime ?? "chưa cấu hình" };
    let answer = localAnswer(parsed.data.message, context, facts);
    let provider = "museum-data";

    if (process.env.OPENAI_API_KEY) {
      const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "gpt-4o-mini",
          temperature: 0.3,
          messages: [
            { role: "system", content: "Bạn là MuseAI, trợ lý bảo tàng. Trả lời bằng tiếng Việt, ngắn gọn, chỉ khẳng định điều có trong ngữ cảnh; nói rõ khi dữ liệu không có. Không tự bịa số liệu." },
            { role: "user", content: `Ngữ cảnh dữ liệu bảo tàng:\nHiện vật phù hợp:\n${context || "Không có hiện vật phù hợp."}\nTriển lãm đang hoạt động: ${facts.exhibitions.join("; ") || "không có"}.\nLượt khách ghi nhận hôm nay: ${todayVisitors}; 30 ngày gần nhất: ${monthVisitors}.\nGiá vé tiêu chuẩn: ${facts.ticketPriceVnd} VND. Giờ mở cửa: ${facts.openingTime}–${facts.closingTime}.\n\nCâu hỏi: ${parsed.data.message}` },
          ],
        }),
        signal: AbortSignal.timeout(12000),
      });
      if (upstream.ok) {
        const payload = await upstream.json();
        answer = payload.choices?.[0]?.message?.content || answer;
        provider = "openai";
      }
    }

    await prisma.aiMessage.createMany({ data: [
      { sessionId, role: "user", content: parsed.data.message },
      { sessionId, role: "assistant", content: answer },
    ] }).catch(() => undefined);
    return Response.json({ answer, sessionId, provider });
  } catch {
    return Response.json({ error: "MuseAI chưa kết nối được dữ liệu. Hãy thử lại sau." }, { status: 503 });
  }
}
