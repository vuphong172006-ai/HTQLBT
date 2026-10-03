"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

type ChatLine = { role: "user" | "assistant"; content: string };

type ChatResponse = { answer?: string; sessionId?: string; error?: string };
const suggestedQuestions = [
  { label: "Giờ mở cửa", question: "Bảo tàng mở cửa mấy giờ?" },
  { label: "Giá vé", question: "Giá vé tham quan là bao nhiêu?" },
  { label: "Cách đặt vé", question: "Tôi đặt vé online như thế nào?" },
  { label: "Triển lãm", question: "Hiện có những triển lãm nào?" },
  { label: "Hiện vật", question: "Cho tôi xem thông tin Trống đồng Ngọc Lũ." },
  { label: "Trẻ em", question: "Trẻ em có được miễn phí vé không?" },
];

export default function CustomerChatBubble() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [lines, setLines] = useState<ChatLine[]>([
    { role: "assistant", content: "Xin chào, tôi là MuseAI. Tôi có thể giúp bạn tìm hiện vật, triển lãm và thông tin tham quan." },
  ]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    if (!open || !messagesRef.current) return;
    messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, busy, open]);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || busy) return;

    setLines((current) => [...current, { role: "user", content: message }]);
    setInput("");
    setBusy(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId: sessionId || undefined }),
      });
      const data = await response.json().catch(() => ({})) as ChatResponse;
      if (!response.ok) throw new Error(data.error || "MuseAI tạm thời chưa phản hồi. Vui lòng thử lại.");
      setSessionId(data.sessionId || sessionId);
      setLines((current) => [...current, { role: "assistant", content: data.answer || "Tôi chưa có câu trả lời cho câu hỏi này." }]);
    } catch (reason) {
      const text = reason instanceof Error ? reason.message : "Không thể kết nối MuseAI. Vui lòng thử lại.";
      setLines((current) => [...current, { role: "assistant", content: text }]);
    } finally {
      setBusy(false);
    }
  };

  return <>
    <button
      className="chat-fab"
      type="button"
      aria-label={open ? "Đóng MuseAI" : "Mở MuseAI"}
      aria-expanded={open}
      aria-controls="customer-museai-chat"
      onClick={() => setOpen((current) => !current)}
    >
      {open ? <X size={22} /> : <MessageCircle size={23} />}
      <span className="chat-online" />
    </button>

    {open && <section className="chat-window" id="customer-museai-chat" aria-label="Trò chuyện với MuseAI">
      <header className="chat-titlebar">
        <span className="chat-ai-mark"><Sparkles size={17} /></span>
        <div><strong>MuseAI</strong><small><i /> Trợ lý bảo tàng trực tuyến</small></div>
        <button className="icon-quiet" type="button" onClick={() => setOpen(false)} aria-label="Đóng chat"><X size={17} /></button>
      </header>

      <div className="chat-messages" ref={messagesRef} role="log" aria-live="polite" aria-relevant="additions text">
        {lines.map((line, index) => <div key={`${index}-${line.role}`} className={`chat-line ${line.role}`}>
          <p>{line.content}</p>
        </div>)}
        {busy && <div className="chat-line assistant" aria-label="MuseAI đang trả lời">
          <p className="typing-dots"><i /><i /><i /></p>
        </div>}
      </div>

      <div className="chat-prompts" aria-label="Câu hỏi gợi ý">
        {suggestedQuestions.map((item) => <button key={item.label} type="button" disabled={busy} onClick={() => { setInput(item.question); inputRef.current?.focus(); }}>{item.label}</button>)}
      </div>

      <form className="chat-composer" onSubmit={sendMessage}>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Hỏi về bảo tàng…"
          aria-label="Câu hỏi cho MuseAI"
          maxLength={1200}
          autoComplete="off"
        />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Gửi câu hỏi">
          <Send size={16} />
        </button>
      </form>
      <p className="chat-disclaimer">Câu trả lời AI có thể cần được nhân viên xác minh.</p>
    </section>}
  </>;
}
