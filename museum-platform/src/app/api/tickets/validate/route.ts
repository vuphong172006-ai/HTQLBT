import { Role, TicketStatus } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { user, response } = await requireRole(Role.STAFF);
  if (response) return response;
  if (!user) return Response.json({ error: "Unauthenticated" }, { status: 401 });
  const parsed = z.object({ code: z.string().min(4).max(40) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Mã vé không hợp lệ." }, { status: 400 });
  try {
    const ticket = await prisma.ticket.findUnique({ where: { code: parsed.data.code } });
    if (!ticket) return Response.json({ error: "Không tìm thấy vé." }, { status: 404 });
    if (ticket.status !== TicketStatus.VALID) return Response.json({ error: ticket.status === TicketStatus.USED ? "Vé đã được sử dụng." : "Vé đã bị hủy." }, { status: 409 });
    if (ticket.visitAt.toDateString() !== new Date().toDateString()) return Response.json({ error: "Vé không có hiệu lực trong ngày hôm nay." }, { status: 409 });
    const updated = await prisma.ticket.update({ where: { id: ticket.id, status: TicketStatus.VALID }, data: { status: TicketStatus.USED, scannedAt: new Date(), scannedById: user.id } });
    return Response.json({ ticket: updated });
  } catch {
    return Response.json({ error: "Không thể xác thực vé." }, { status: 503 });
  }
}
