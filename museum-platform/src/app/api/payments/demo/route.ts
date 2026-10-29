import { Role, TicketStatus } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function demoModeOff() {
  return process.env.PAYMENT_MODE !== "demo";
}

export async function GET(request: Request) {
  if (demoModeOff()) return Response.json({ error: "Thanh toán demo đang tắt." }, { status: 404 });
  const { user, response } = await requireRole(Role.CUSTOMER);
  if (response) return response;
  if (!user) return Response.json({ error: "Unauthenticated" }, { status: 401 });
  const ticketId = new URL(request.url).searchParams.get("ticketId");
  if (!ticketId) return Response.json({ error: "Thiếu mã đơn vé." }, { status: 400 });
  try {
    const ticket = await prisma.ticket.findFirst({ where: { id: ticketId, ownerId: user.id }, select: { id: true, code: true, visitorName: true, visitAt: true, quantity: true, amountVnd: true, status: true } });
    if (!ticket) return Response.json({ error: "Không tìm thấy đơn vé." }, { status: 404 });
    return Response.json({ ticket });
  } catch {
    return Response.json({ error: "Không thể tải đơn thanh toán demo." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (demoModeOff()) return Response.json({ error: "Thanh toán demo đang tắt." }, { status: 404 });
  const { user, response } = await requireRole(Role.CUSTOMER);
  if (response) return response;
  if (!user) return Response.json({ error: "Unauthenticated" }, { status: 401 });
  const parsed = z.object({ ticketId: z.string().min(1), outcome: z.enum(["success", "cancel"]) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Yêu cầu thanh toán demo chưa hợp lệ." }, { status: 400 });
  try {
    const result = await prisma.ticket.updateMany({
      where: { id: parsed.data.ticketId, ownerId: user.id, status: TicketStatus.PENDING_PAYMENT },
      data: { status: parsed.data.outcome === "success" ? TicketStatus.VALID : TicketStatus.CANCELLED },
    });
    if (result.count === 0) {
      const ticket = await prisma.ticket.findFirst({ where: { id: parsed.data.ticketId, ownerId: user.id }, select: { status: true } });
      if (!ticket) return Response.json({ error: "Không tìm thấy đơn vé." }, { status: 404 });
      return Response.json({ error: "Đơn vé đã được xử lý hoặc không còn chờ thanh toán.", status: ticket.status }, { status: 409 });
    }
    return Response.json({ status: parsed.data.outcome === "success" ? TicketStatus.VALID : TicketStatus.CANCELLED, simulated: true });
  } catch {
    return Response.json({ error: "Không thể hoàn tất thanh toán demo." }, { status: 503 });
  }
}
