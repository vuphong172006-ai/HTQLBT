import { Role, TicketStatus } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createVnpayPaymentUrl, getVnpayConfig } from "@/lib/vnpay";

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
  const demoPayment = process.env.PAYMENT_MODE === "demo";
  let config: ReturnType<typeof getVnpayConfig> | undefined;
  if (!demoPayment) {
    try {
      config = getVnpayConfig();
    } catch {
      return Response.json({ error: "Thêm VNPAY_TMN_CODE, VNPAY_HASH_SECRET và VNPAY_RETURN_URL vào .env để bật VNPay sandbox." }, { status: 503 });
    }
  }

  const code = `MUS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  let ticketPriceVnd: number;
  try {
    const settings = await prisma.museumSettings.findUnique({ where: { id: "museum" } });
    if (!settings) return Response.json({ error: "Chưa cấu hình giá vé của bảo tàng." }, { status: 503 });
    ticketPriceVnd = settings.ticketPriceVnd;
  } catch {
    return Response.json({ error: "Không thể tải cấu hình giá vé." }, { status: 503 });
  }
  const amountVnd = parsed.data.quantity * ticketPriceVnd;
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "127.0.0.1";
  try {
    const ticket = await prisma.ticket.create({
      data: { ...parsed.data, visitAt, ownerId: user.id, amountVnd, status: TicketStatus.PENDING_PAYMENT, code },
    });
    const paymentUrl = demoPayment
      ? `/demo-payment?ticketId=${encodeURIComponent(ticket.id)}`
      : createVnpayPaymentUrl({ config: config!, transactionRef: ticket.id, ticketCode: ticket.code, amountVnd, clientIp });
    return Response.json({ ticket, paymentUrl, paymentMode: demoPayment ? "demo" : "vnpay" }, { status: 201 });
  } catch {
    return Response.json({ error: "Không thể khởi tạo thanh toán VNPay." }, { status: 503 });
  }
}
