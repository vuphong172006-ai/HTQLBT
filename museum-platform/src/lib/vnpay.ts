import { createHmac, timingSafeEqual } from "node:crypto";

export type VnpayConfig = {
  tmnCode: string;
  hashSecret: string;
  paymentUrl: string;
  returnUrl: string;
};

const defaultPaymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

export function getVnpayConfig(): VnpayConfig {
  const tmnCode = process.env.VNPAY_TMN_CODE?.trim();
  const hashSecret = process.env.VNPAY_HASH_SECRET?.trim();
  const paymentUrl = process.env.VNPAY_PAYMENT_URL?.trim() || defaultPaymentUrl;
  const returnUrl = process.env.VNPAY_RETURN_URL?.trim();

  if (!tmnCode || !hashSecret || !returnUrl) {
    throw new Error("VNPay sandbox chưa được cấu hình.");
  }

  try {
    new URL(paymentUrl);
    new URL(returnUrl);
  } catch {
    throw new Error("URL cấu hình VNPay không hợp lệ.");
  }

  return { tmnCode, hashSecret, paymentUrl, returnUrl };
}

function formatVnpayDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}${values.month}${values.day}${values.hour}${values.minute}${values.second}`;
}

function getSigningData(params: URLSearchParams) {
  const entries = Array.from(params.entries())
    .filter(([key]) => key.startsWith("vnp_") && key !== "vnp_SecureHash" && key !== "vnp_SecureHashType")
    .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
  return new URLSearchParams(entries).toString();
}

export function createVnpayPaymentUrl({
  config,
  transactionRef,
  ticketCode,
  amountVnd,
  clientIp,
  now = new Date(),
}: {
  config: VnpayConfig;
  transactionRef: string;
  ticketCode: string;
  amountVnd: number;
  clientIp: string;
  now?: Date;
}) {
  const params = new URLSearchParams({
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: config.tmnCode,
    vnp_Amount: String(amountVnd * 100),
    vnp_CurrCode: "VND",
    vnp_TxnRef: transactionRef,
    vnp_OrderInfo: `Thanh toan ve ${ticketCode.replace(/[^a-zA-Z0-9 ]/g, "")}`,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl: config.returnUrl,
    vnp_IpAddr: clientIp,
    vnp_CreateDate: formatVnpayDate(now),
    vnp_ExpireDate: formatVnpayDate(new Date(now.getTime() + 15 * 60 * 1000)),
  });
  const signingData = getSigningData(params);
  const secureHash = createHmac("sha512", config.hashSecret).update(signingData, "utf8").digest("hex");
  const url = new URL(config.paymentUrl);
  url.search = `${signingData}&vnp_SecureHash=${secureHash}`;
  return url.toString();
}

export function verifyVnpaySignature(params: URLSearchParams, hashSecret: string) {
  const receivedHash = params.get("vnp_SecureHash") || "";
  if (!/^[a-f\d]{128}$/i.test(receivedHash)) return false;

  const expectedHash = createHmac("sha512", hashSecret).update(getSigningData(params), "utf8").digest();
  const providedHash = Buffer.from(receivedHash, "hex");
  return providedHash.length === expectedHash.length && timingSafeEqual(providedHash, expectedHash);
}
