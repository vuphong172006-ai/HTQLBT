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
    const scannedAt = new Date();
    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.ticket.updateMany({ where: { id: ticket.id, status: TicketStatus.VALID }, data: { status: TicketStatus.USED, scannedAt, scannedById: user.id } });
      if (result.count === 0) throw new Error("TICKET_ALREADY_USED");
      await tx.visitorVisit.create({ data: { visitorName: ticket.visitorName, ticketCode: ticket.code, source: "TICKET", visitedAt: scannedAt, recordedById: user.id } });
      return tx.ticket.findUniqueOrThrow({ where: { id: ticket.id } });
    });
    return Response.json({ ticket: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "TICKET_ALREADY_USED") return Response.json({ error: "Vé đã được sử dụng." }, { status: 409 });
    return Response.json({ error: "Không thể xác thực vé." }, { status: 503 });
  }
}
