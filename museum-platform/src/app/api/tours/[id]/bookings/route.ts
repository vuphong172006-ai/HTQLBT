import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireRole(Role.ADMIN, Role.STAFF, Role.CUSTOMER);
  if (response) return response;
  const { id } = await context.params;
  try {
    const bookings = await prisma.tourBooking.findMany({
      where: { tourId: id, ...(user?.role === Role.CUSTOMER ? { userId: user.id } : {}) },
      orderBy: { createdAt: "desc" },
    });
    return Response.json({ bookings });
  } catch {
    return Response.json({ error: "Không thể tải danh sách đăng ký tour." }, { status: 503 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireRole(Role.ADMIN, Role.STAFF, Role.CUSTOMER);
  if (response) return response;
  const parsed = z.object({ name: z.string().min(2).max(120), email: z.string().email(), quantity: z.number().int().min(1).max(12) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Thông tin đăng ký tour chưa hợp lệ." }, { status: 400 });
  const { id } = await context.params;
  try {
    const booking = await prisma.$transaction(async (tx) => {
      const tour = await tx.tour.findUnique({ where: { id } });
      if (!tour || tour.startsAt < new Date()) throw new Error("TOUR_UNAVAILABLE");
      const reserved = await tx.tourBooking.aggregate({ where: { tourId: id }, _sum: { quantity: true } });
      const remaining = tour.capacity - (reserved._sum.quantity ?? 0);
      if (remaining < parsed.data.quantity) throw new Error("CAPACITY_REACHED");
      return tx.tourBooking.create({ data: { ...parsed.data, email: parsed.data.email.toLowerCase(), userId: user?.id, tourId: id } });
    }, { isolationLevel: "Serializable" });
    return Response.json({ booking }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "TOUR_UNAVAILABLE") return Response.json({ error: "Không tìm thấy tour hoặc lịch đã qua." }, { status: 404 });
    if (message === "CAPACITY_REACHED") return Response.json({ error: "Tour không còn đủ chỗ." }, { status: 409 });
    return Response.json({ error: "Không thể đăng ký tour." }, { status: 503 });
  }
}
