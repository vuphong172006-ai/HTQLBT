import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { user, response } = await requireRole(Role.ADMIN, Role.STAFF, Role.CUSTOMER);
  if (response) return response;
  if (!user) return Response.json({ error: "Unauthenticated" }, { status: 401 });
  try {
    const tours = await prisma.tour.findMany({ include: { guide: { select: { name: true } } }, orderBy: { startsAt: "asc" } });
    return Response.json({ tours });
  } catch {
    return Response.json({ error: "Không thể tải lịch tour." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const { response } = await requireRole(Role.ADMIN, Role.STAFF);
  if (response) return response;
  const parsed = z.object({ title: z.string().min(3), startsAt: z.string().datetime(), durationMins: z.number().int().min(15).max(240), capacity: z.number().int().min(1).max(50), route: z.array(z.string().min(1)).min(1) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Thông tin tour chưa hợp lệ." }, { status: 400 });
  try {
    const tour = await prisma.tour.create({ data: { ...parsed.data, startsAt: new Date(parsed.data.startsAt) } });
    return Response.json({ tour }, { status: 201 });
  } catch {
    return Response.json({ error: "Không thể tạo lịch tour." }, { status: 503 });
  }
}
