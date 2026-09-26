import { Role, TicketStatus } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const purchaseSchema = z.object({ visitorName: z.string().min(2), visitorEmail: z.string().email(), visitAt: z.string().datetime(), quantity: z.number().int().min(1).max(12) });

export async function GET() {
  const { user, response } = await requireRole(Role.ADMIN, Role.STAFF, Role.CUSTOMER);
  if (response) return response;
  if (!user) return Response.json({ error: "Unauthenticated" }, { status: 401 });
  try {
    const tickets = await prisma.ticket.findMany({ where: user.role === Role.CUSTOMER ? { ownerId: user.id } : undefined, orderBy: { createdAt: "desc" }, take: 100 });
    return Response.json({ tickets });
  } catch {
    return Response.json({ error: "Không thể tải vé." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const { user, response } = await requireRole(Role.CUSTOMER);
  if (response) return response;
  if (!user) return Response.json({ error: "Unauthenticated" }, { status: 401 });
  const parsed = purchaseSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Thông tin đặt vé không hợp lệ." }, { status: 400 });
  const visitAt = new Date(parsed.data.visitAt);
  if (visitAt < new Date()) return Response.json({ error: "Ngày tham quan phải ở tương lai." }, { status: 400 });
  try {
    const ticket = await prisma.ticket.create({
      data: { ...parsed.data, visitAt, ownerId: user.id, amountVnd: parsed.data.quantity * 80000, status: TicketStatus.VALID, code: `MUS-${crypto.randomUUID().slice(0, 8).toUpperCase()}` },
    });
    return Response.json({ ticket }, { status: 201 });
  } catch {
    return Response.json({ error: "Không thể tạo vé." }, { status: 503 });
  }
}
