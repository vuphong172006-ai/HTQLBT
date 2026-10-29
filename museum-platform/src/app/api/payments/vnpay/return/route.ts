import { TicketStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getVnpayConfig, verifyVnpaySignature } from "@/lib/vnpay";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const destination = new URL("/", request.url);
  let paymentStatus = "invalid";
  let ticketCode = "";

  try {
    const config = getVnpayConfig();
    if (params.get("vnp_TmnCode") === config.tmnCode && verifyVnpaySignature(params, config.hashSecret)) {
      const transactionRef = params.get("vnp_TxnRef");
      const amount = Number(params.get("vnp_Amount"));
      if (transactionRef && Number.isSafeInteger(amount)) {
        const ticket = await prisma.ticket.findUnique({ where: { id: transactionRef } });
        if (ticket && amount === ticket.amountVnd * 100) {
          ticketCode = ticket.code;
          const paid = params.get("vnp_ResponseCode") === "00" && params.get("vnp_TransactionStatus") === "00";
          paymentStatus = paid
            ? ticket.status === TicketStatus.VALID ? "success" : "processing"
            : "failed";
        }
      }
    }
  } catch {
    paymentStatus = "invalid";
  }

  destination.searchParams.set("payment", paymentStatus);
  if (ticketCode) destination.searchParams.set("ticket", ticketCode);
  return Response.redirect(destination, 303);
}
