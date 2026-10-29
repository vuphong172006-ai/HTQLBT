"use client";

import { useEffect, useState } from "react";

type DemoTicket = { id: string; code: string; visitorName: string; visitAt: string; quantity: number; amountVnd: number; status: string };

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Không thể xử lý đơn thanh toán.");
  return data as T;
}

export default function DemoPaymentPage() {
  const [ticket, setTicket] = useState<DemoTicket | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("ticketId") || "";
    setTicketId(id);
    if (!id) { setError("Không tìm thấy mã đơn vé."); return; }
    api<{ ticket: DemoTicket }>(`/api/payments/demo?ticketId=${encodeURIComponent(id)}`)
      .then(({ ticket: result }) => setTicket(result))
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Không thể tải đơn thanh toán."));
  }, []);

  const finish = async (outcome: "success" | "cancel") => {
    setBusy(true);
    setError("");
    try {
      await api("/api/payments/demo", { method: "POST", body: JSON.stringify({ ticketId, outcome }) });
      window.location.assign(`/?payment=demo-${outcome === "success" ? "success" : "cancelled"}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể xử lý đơn thanh toán.");
      setBusy(false);
    }
  };

  return <main className="demo-payment-page"><section className="demo-payment-card">
    <span className="demo-payment-badge">CHẾ ĐỘ DEMO · KHÔNG THU TIỀN THẬT</span>
    <h1>Xác nhận thanh toán</h1>
    <p className="demo-payment-intro">Màn hình mô phỏng để thử luồng đặt vé. Không có giao dịch ngân hàng hay VNPay nào được thực hiện.</p>
    {error && <p className="demo-payment-error" role="alert">{error}</p>}
    {ticket ? <>
      <dl className="demo-payment-details">
        <div><dt>Mã vé</dt><dd>{ticket.code}</dd></div>
        <div><dt>Người đặt</dt><dd>{ticket.visitorName}</dd></div>
        <div><dt>Ngày tham quan</dt><dd>{new Date(ticket.visitAt).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })}</dd></div>
        <div><dt>Số khách</dt><dd>{ticket.quantity}</dd></div>
        <div className="demo-payment-total"><dt>Tổng tiền mô phỏng</dt><dd>{new Intl.NumberFormat("vi-VN").format(ticket.amountVnd)}₫</dd></div>
      </dl>
      {ticket.status === "PENDING_PAYMENT" ? <div className="demo-payment-actions">
        <button type="button" disabled={busy} onClick={() => finish("cancel")}>Hủy giao dịch</button>
        <button type="button" className="demo-pay-confirm" disabled={busy} onClick={() => finish("success")}>{busy ? "Đang xử lý…" : "Xác nhận thanh toán demo"}</button>
      </div> : <p className="demo-payment-state">Đơn vé hiện ở trạng thái: {ticket.status}</p>}
    </> : !error && <p>Đang tải thông tin đơn vé…</p>}
  </section></main>;
}
