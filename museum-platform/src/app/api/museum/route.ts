import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { response } = await requireRole(Role.ADMIN, Role.STAFF, Role.CUSTOMER);
  if (response) return response;
  try {
    const settings = await prisma.museumSettings.findUnique({ where: { id: "museum" } });
    return settings ? Response.json({ museum: { ...settings, paymentMode: process.env.PAYMENT_MODE === "demo" ? "demo" : "vnpay" } }) : Response.json({ error: "Chưa cấu hình thông tin bảo tàng." }, { status: 404 });
  } catch {
    return Response.json({ error: "Không thể tải thông tin bảo tàng." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const { response } = await requireRole(Role.ADMIN);
  if (response) return response;
  const parsed = z.object({
    name: z.string().min(2).max(180), address: z.string().min(3).max(250), city: z.string().min(2).max(100),
    founded: z.number().int().min(1).max(new Date().getFullYear()),
    openingTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    closingTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    ticketPriceVnd: z.number().int().min(0).max(100000000),
  }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Thông tin bảo tàng chưa hợp lệ." }, { status: 400 });
  if (parsed.data.closingTime <= parsed.data.openingTime) return Response.json({ error: "Giờ đóng cửa phải sau giờ mở cửa." }, { status: 400 });
  try {
    const museum = await prisma.museumSettings.upsert({ where: { id: "museum" }, create: { id: "museum", ...parsed.data }, update: parsed.data });
    return Response.json({ museum });
  } catch {
    return Response.json({ error: "Không thể cập nhật cấu hình bảo tàng." }, { status: 503 });
  }
}
