import { TicketStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getVnpayConfig, verifyVnpaySignature } from "@/lib/vnpay";

function ipnResponse(RspCode: string, Message: string) {
  return Response.json({ RspCode, Message });
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  let config;
  try {
    config = getVnpayConfig();
  } catch {
    return ipnResponse("99", "Configuration error");
  }

  if (params.get("vnp_TmnCode") !== config.tmnCode || !verifyVnpaySignature(params, config.hashSecret)) {
    return ipnResponse("97", "Invalid signature");
  }

  const transactionRef = params.get("vnp_TxnRef");
  const amount = Number(params.get("vnp_Amount"));
  if (!transactionRef) return ipnResponse("01", "Order not found");
  if (!Number.isSafeInteger(amount)) return ipnResponse("04", "Invalid amount");

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: transactionRef } });
    if (!ticket) return ipnResponse("01", "Order not found");
    if (amount !== ticket.amountVnd * 100) return ipnResponse("04", "Invalid amount");
    if (ticket.status !== TicketStatus.PENDING_PAYMENT) return ipnResponse("02", "Order already confirmed");

    const paid = params.get("vnp_ResponseCode") === "00" && params.get("vnp_TransactionStatus") === "00";
    const result = await prisma.ticket.updateMany({
      where: { id: ticket.id, status: TicketStatus.PENDING_PAYMENT },
      data: { status: paid ? TicketStatus.VALID : TicketStatus.CANCELLED },
    });
    if (result.count === 0) return ipnResponse("02", "Order already confirmed");
    return ipnResponse("00", "Confirm Success");
  } catch {
    return ipnResponse("99", "Unknown error");
  }
}
