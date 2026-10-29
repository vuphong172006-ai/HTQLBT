import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { user, response } = await requireRole(Role.ADMIN, Role.STAFF, Role.CUSTOMER);
  if (response) return response;
  const now = new Date();
  try {
    const exhibitions = await prisma.exhibition.findMany({
      where: user?.role === Role.CUSTOMER ? { active: true, endsAt: { gte: now } } : undefined,
      orderBy: { startsAt: "asc" },
    });
    return Response.json({ exhibitions });
  } catch {
    return Response.json({ error: "Không thể tải danh sách triển lãm." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const { response } = await requireRole(Role.ADMIN);
  if (response) return response;
  const parsed = z.object({
    slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/), name: z.string().min(2).max(180),
    description: z.string().min(10), location: z.string().min(2),
    startsAt: z.string().datetime(), endsAt: z.string().datetime(), imageUrl: z.string().url().optional(),
  }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Thông tin triển lãm chưa hợp lệ." }, { status: 400 });
  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = new Date(parsed.data.endsAt);
  if (endsAt <= startsAt) return Response.json({ error: "Ngày kết thúc phải sau ngày khai mạc." }, { status: 400 });
  try {
    const exhibition = await prisma.exhibition.create({ data: { ...parsed.data, startsAt, endsAt } });
    return Response.json({ exhibition }, { status: 201 });
  } catch {
    return Response.json({ error: "Không tạo được triển lãm; đường dẫn có thể đã được dùng." }, { status: 409 });
  }
}
