"use client";

import {
  Activity, ArrowDownRight, ArrowLeft, ArrowRight, BadgeCheck, Bell, BookOpen, CircleAlert,
  Camera, Check, ChevronDown, Clock3, Compass, CreditCard, ImagePlus, Landmark,
  Info, LayoutDashboard, LogOut, Map, Menu, QrCode, Search,
  Settings2, ShieldCheck, Sparkles, Ticket, Users, X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { FormEvent, useEffect, useRef, useState } from "react";
import CustomerChatBubble from "@/components/customer-chat-bubble";

type Role = "ADMIN" | "STAFF" | "CUSTOMER";
type User = { id: string; name: string; email: string; role: Role };
type Artifact = { id: string; code: string; name: string; period: string; year: string; category: string; description: string; status: string; imageUrl?: string | null };
type TicketRecord = { id: string; code: string; visitorName: string; visitorEmail: string; visitAt: string; quantity: number; amountVnd: number; status: string };
type Employee = { id: string; name: string; email: string; role: Role; active: boolean };
type Tour = { id: string; title: string; startsAt: string; durationMins: number; capacity: number; guide?: { name: string } | null; route: string[] };
type Analytics = { totalVisits: number; ticketCount: number; ticketRevenueVnd: number; activeExhibitions: number; visitsByDay: { date: string; count: number }[]; visitsByHour: { hour: string; count: number }[] };
type MuseumSettings = { ticketPriceVnd: number; openingTime: string; closingTime: string; paymentMode: "demo" | "vnpay" };
type NotificationItem = { title: string; detail: string; page: string };

const demoAccounts = [
  { role: "ADMIN" as Role, email: "admin@musea.vn", label: "Quản trị" },
  { role: "STAFF" as Role, email: "staff@musea.vn", label: "Nhân viên" },
  { role: "CUSTOMER" as Role, email: "guest@musea.vn", label: "Khách tham quan" },
];
const roleNames: Record<Role, string> = { ADMIN: "Quản trị viên", STAFF: "Nhân viên bảo tàng", CUSTOMER: "Khách tham quan" };
const statusNames: Record<string, string> = { PENDING: "Chờ duyệt", PENDING_PAYMENT: "Chờ thanh toán", APPROVED: "Đã duyệt", REJECTED: "Từ chối", ON_DISPLAY: "Đang trưng bày", CONSERVATION: "Bảo tồn", RESEARCH: "Nghiên cứu", VALID: "Còn hiệu lực", USED: "Đã sử dụng", CANCELLED: "Đã hủy" };
const money = (amount: number) => new Intl.NumberFormat("vi-VN").format(amount) + "₫";
const dateText = (value: string) => new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Yêu cầu không thành công.");
  return data as T;
}

export default function MuseumApp() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState("overview");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState<"success" | "error" | "info">("success");
  const [email, setEmail] = useState("admin@musea.vn");
  const [password, setPassword] = useState("Musea@2026");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [museumSettings, setMuseumSettings] = useState<MuseumSettings>({ ticketPriceVnd: 80000, openingTime: "08:00", closingTime: "17:00", paymentMode: "demo" });
  const [query, setQuery] = useState("");
  const [route, setRoute] = useState<{ name: string; duration: number }[]>([]);
  const [routeMinutes, setRouteMinutes] = useState(120);
  const [interests, setInterests] = useState<string[]>(["Lịch sử", "Khảo cổ"]);
  const [imagePreview, setImagePreview] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanCode, setScanCode] = useState("");
  const [scanResult, setScanResult] = useState("");

  const loadWorkspace = async (activeUser: User) => {
    const requests: Promise<void>[] = [
      api<{ artifacts: Artifact[] }>("/api/artifacts").then((data) => setArtifacts(data.artifacts)),
      api<{ tickets: TicketRecord[] }>("/api/tickets").then((data) => setTickets(data.tickets)),
      api<{ museum: MuseumSettings }>("/api/museum").then((data) => setMuseumSettings(data.museum)),
    ];
    if (activeUser.role === "ADMIN") requests.push(api<{ employees: Employee[] }>("/api/employees").then((data) => setEmployees(data.employees)));
    if (activeUser.role !== "CUSTOMER") requests.push(api<Analytics>("/api/analytics?days=30").then(setAnalytics));
    if (activeUser.role !== "CUSTOMER") requests.push(api<{ tours: Tour[] }>("/api/tours").then((data) => setTours(data.tours)));
    await Promise.allSettled(requests);
  };

  useEffect(() => {
    let cancelled = false;
    api<{ user: User }>("/api/auth/session")
      .then(async ({ user: restored }) => {
        if (cancelled) return;
        setUser(restored);
        setPage(restored.role === "CUSTOMER" ? "tickets" : "overview");
        await loadWorkspace(restored);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!cameraOn || !videoRef.current) return;
    let stream: MediaStream | undefined;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((result) => {
        stream = result;
        if (videoRef.current) videoRef.current.srcObject = result;
      })
      .catch(() => { setNotice("Không truy cập được camera. Hãy kiểm tra quyền camera hoặc dùng tra cứu ảnh."); setNoticeType("error"); setCameraOn(false); });
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [cameraOn]);

  useEffect(() => {
    if (!notificationsOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!notificationPanelRef.current?.contains(event.target as Node)) setNotificationsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotificationsOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [notificationsOpen]);

  const notify = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotice(message);
    setNoticeType(type);
    window.setTimeout(() => setNotice(""), 3200);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (!payment) return;
    const messages: Record<string, string> = {
      success: "VNPay đã xác nhận thanh toán. Vé của bạn đã có hiệu lực.",
      "demo-success": "Thanh toán demo thành công. Vé của bạn đã có hiệu lực; không có tiền thật được thu.",
      "demo-cancelled": "Bạn đã hủy thanh toán demo. Vé chưa được phát hành.",
      processing: "VNPay báo thanh toán thành công; vé đang chờ xác nhận từ máy chủ.",
      failed: "Thanh toán chưa hoàn tất. Vé chưa được phát hành.",
      invalid: "Không thể xác minh kết quả thanh toán từ VNPay.",
    };
    const type = payment === "success" || payment === "demo-success" ? "success" : payment === "processing" ? "info" : payment === "demo-cancelled" ? "info" : "error";
    notify(messages[payment] || "Đã quay lại từ VNPay.", type);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const refresh = () => user && loadWorkspace(user);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api<{ user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setUser(result.user);
      setPage(result.user.role === "CUSTOMER" ? "tickets" : "overview");
      await loadWorkspace(result.user);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Đăng nhập thất bại.");
    } finally { setBusy(false); }
  };

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null); setArtifacts([]); setTickets([]); setEmployees([]); setTours([]); setPage("overview");
  };

  const validateTicket = async (event: FormEvent) => {
    event.preventDefault(); setScanResult("");
    try {
      const result = await api<{ ticket: TicketRecord }>("/api/tickets/validate", { method: "POST", body: JSON.stringify({ code: scanCode.trim() }) });
      setScanResult(`Vé ${result.ticket.code} hợp lệ · ${result.ticket.visitorName} · ${result.ticket.quantity} khách.`);
      setScanCode(""); refresh();
    } catch (reason) { setScanResult(reason instanceof Error ? reason.message : "Không xác thực được vé."); }
  };

  const buyTicket = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const result = await api<{ ticket: TicketRecord; paymentUrl: string }>("/api/tickets", { method: "POST", body: JSON.stringify({ visitorName: form.get("visitorName"), visitorEmail: form.get("visitorEmail"), visitAt: new Date(`${form.get("visitDate")}T${form.get("visitTime")}:00`).toISOString(), quantity: Number(form.get("quantity")) }) });
      window.location.assign(result.paymentUrl);
    } catch (reason) { notify(reason instanceof Error ? reason.message : "Không tạo được vé.", "error"); }
  };

  const createArtifact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    if (!body.imageUrl) delete body.imageUrl;
    try {
      await api("/api/artifacts", { method: "POST", body: JSON.stringify(body) });
      notify(user?.role === "STAFF" ? "Đã gửi hiện vật chờ quản trị phê duyệt." : "Đã thêm hiện vật.");
      event.currentTarget.reset(); refresh();
    } catch (reason) { notify(reason instanceof Error ? reason.message : "Không thể thêm hiện vật."); }
  };

  const reviewArtifact = async (artifact: Artifact, status: "APPROVED" | "REJECTED") => {
    try {
      await api("/api/artifacts", { method: "PATCH", body: JSON.stringify({ id: artifact.id, status }) });
      notify(status === "APPROVED" ? "Đã phê duyệt hiện vật." : "Đã từ chối hiện vật."); refresh();
    } catch (reason) { notify(reason instanceof Error ? reason.message : "Không cập nhật được hiện vật."); }
  };

  const logConservation = async (artifact: Artifact) => {
    const note = window.prompt(`Ghi chú tình trạng cho ${artifact.name}:`);
    if (!note) return;
    try {
      await api("/api/artifacts", { method: "PATCH", body: JSON.stringify({ id: artifact.id, status: "CONSERVATION", condition: "Cần theo dõi", note }) });
      notify("Đã cập nhật nhật ký bảo tồn."); refresh();
    } catch (reason) { notify(reason instanceof Error ? reason.message : "Không ghi được nhật ký."); }
  };

  const createEmployee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    try {
      await api("/api/employees", { method: "POST", body: JSON.stringify(Object.fromEntries(form.entries())) });
      notify("Đã tạo tài khoản nhân sự."); event.currentTarget.reset(); refresh();
    } catch (reason) { notify(reason instanceof Error ? reason.message : "Không tạo được tài khoản."); }
  };

  const createTour = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const startsAt = new Date(`${form.get("date")}T${form.get("time")}:00`).toISOString();
    try {
      await api("/api/tours", { method: "POST", body: JSON.stringify({ title: form.get("title"), startsAt, durationMins: Number(form.get("durationMins")), capacity: Number(form.get("capacity")), route: String(form.get("route")).split(",").map((part) => part.trim()).filter(Boolean) }) });
      notify("Đã thêm lịch tour."); event.currentTarget.reset(); refresh();
    } catch (reason) { notify(reason instanceof Error ? reason.message : "Không tạo được tour."); }
  };

  const suggestRoute = async () => {
    try {
      const result = await api<{ route: { name: string; duration: number }[]; totalMinutes: number }>("/api/ai/itinerary", { method: "POST", body: JSON.stringify({ minutes: routeMinutes, interests }) });
      setRoute(result.route); notify(`Đã gợi ý tuyến ${result.totalMinutes} phút.`);
    } catch (reason) { notify(reason instanceof Error ? reason.message : "Không tạo được lộ trình."); }
  };

  if (!user) return <LoginScreen email={email} password={password} setEmail={setEmail} setPassword={setPassword} onLogin={login} error={error} busy={busy} setError={setError} />;

  const pageLabels: Record<string, string> = {
    overview: "Tổng quan", tickets: "Vé tham quan", catalog: "Tra cứu hiện vật", map: "Bản đồ trưng bày", route: "Lộ trình tham quan", visual: "Tìm hiện vật bằng ảnh",
    scan: "Kiểm tra vé tại cổng", conservation: "Bảo tồn hiện vật", tours: "Lịch tour", artifacts: "Quản lý hiện vật", approvals: "Phê duyệt hiện vật", employees: "Quản lý nhân sự", settings: "Cấu hình hệ thống",
  };
  const navigation = user.role === "ADMIN"
    ? [{ id: "overview", label: "Tổng quan", icon: LayoutDashboard }, { id: "artifacts", label: "Hiện vật", icon: Landmark }, { id: "approvals", label: "Phê duyệt", icon: BadgeCheck }, { id: "employees", label: "Nhân sự", icon: Users }, { id: "settings", label: "Cấu hình", icon: Settings2 }]
    : user.role === "STAFF"
      ? [{ id: "overview", label: "Ca làm hôm nay", icon: LayoutDashboard }, { id: "artifacts", label: "Đề xuất hiện vật", icon: ImagePlus }, { id: "scan", label: "Quét vé", icon: QrCode }, { id: "conservation", label: "Bảo tồn", icon: ShieldCheck }, { id: "tours", label: "Lịch tour", icon: Compass }]
      : [{ id: "tickets", label: "Mua vé", icon: Ticket }, { id: "catalog", label: "Hiện vật", icon: Landmark }, { id: "map", label: "Bản đồ", icon: Map }, { id: "route", label: "Lộ trình AI", icon: Compass }, { id: "visual", label: "Tìm bằng ảnh", icon: Camera }];

  const filteredArtifacts = artifacts.filter((item) => `${item.name} ${item.code} ${item.period} ${item.category}`.toLocaleLowerCase("vi-VN").includes(query.toLocaleLowerCase("vi-VN")));
  const displayedArtifacts = user.role === "ADMIN" && page === "approvals" ? artifacts.filter((item) => item.status === "PENDING") : filteredArtifacts;
  const notificationItems: NotificationItem[] = [];
  const pendingArtifacts = artifacts.filter((item) => item.status === "PENDING").length;
  const validTickets = tickets.filter((ticket) => ticket.status === "VALID").length;
  const pendingTickets = tickets.filter((ticket) => ticket.status === "PENDING_PAYMENT").length;
  const conservationArtifacts = artifacts.filter((item) => item.status === "CONSERVATION").length;
  if (user.role === "ADMIN" && pendingArtifacts) notificationItems.push({ title: `${pendingArtifacts} hồ sơ hiện vật chờ duyệt`, detail: "Mở hàng đợi để xem và xử lý hồ sơ.", page: "approvals" });
  if (user.role === "STAFF" && validTickets) notificationItems.push({ title: `${validTickets} vé còn hiệu lực`, detail: "Có thể kiểm tra vé tại cổng.", page: "scan" });
  if (user.role === "STAFF" && conservationArtifacts) notificationItems.push({ title: `${conservationArtifacts} hiện vật đang bảo tồn`, detail: "Xem hồ sơ và cập nhật nhật ký bảo tồn.", page: "conservation" });
  if (user.role === "CUSTOMER" && pendingTickets) notificationItems.push({ title: `${pendingTickets} vé chờ thanh toán`, detail: "Hoàn tất thanh toán để vé có hiệu lực.", page: "tickets" });
  if (user.role === "CUSTOMER" && validTickets) notificationItems.push({ title: `${validTickets} vé đang có hiệu lực`, detail: "Mở vé của bạn để xem mã QR.", page: "tickets" });

  return (
    <main className="min-h-screen bg-[#f3f5f8] text-slate-800">
      <div className="app-shell">
        <aside className="sidebar">
          <a className="brand-lockup" href="#overview" onClick={(event) => { event.preventDefault(); setPage("overview"); }}>
            <span className="brand-mark"><Landmark size={20} /></span>
            <span><strong>MUSEA</strong><small>HERITAGE INTELLIGENCE</small></span>
          </a>
          <div className="museum-switch"><span className="museum-dot" /><span>Bảo tàng Lịch sử Quốc gia</span><ChevronDown size={15} /></div>
          <p className="nav-caption">KHÔNG GIAN LÀM VIỆC</p>
          <nav className="nav-stack" aria-label="Điều hướng">
            {navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setPage(id); setQuery(""); }} className={`nav-link ${page === id ? "active" : ""}`}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{id === "approvals" && artifacts.some((item) => item.status === "PENDING") && <i className="nav-count">{artifacts.filter((item) => item.status === "PENDING").length}</i>}</button>)}
          </nav>
          {user.role === "ADMIN" && <div className="sidebar-lower"><span>VẬN HÀNH</span><div><Activity size={15} /> Hệ thống ổn định</div></div>}
          <div className="profile-block"><span className="avatar">{user.name.split(" ").slice(-2).map((part) => part[0]).join("")}</span><span className="profile-name"><strong>{user.name}</strong><small>{roleNames[user.role]}</small></span><button className="icon-quiet" title="Đăng xuất" onClick={() => setShowLogoutConfirm(true)}><LogOut size={16} /></button></div>
        </aside>

        <section className="main-column">
          <header className="topbar"><div className="crumbs"><span>Không gian bảo tàng</span><ArrowRight size={13} /><strong>{pageLabels[page] || "MUSEA"}</strong></div><div className="topbar-actions"><span className="live-chip"><i /> ĐANG HOẠT ĐỘNG</span><div className="notification-wrap" ref={notificationPanelRef}><button className="icon-quiet notification" type="button" title="Thông báo" aria-label="Mở thông báo" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}><Bell size={18} />{notificationItems.length > 0 && <i />}</button>{notificationsOpen && <section className="notification-panel" role="dialog" aria-label="Thông báo"><div className="notification-panel-heading"><div><strong>Thông báo</strong><small>{notificationItems.length ? `${notificationItems.length} mục cần chú ý` : "Cập nhật từ hệ thống"}</small></div><button className="notification-close" type="button" aria-label="Đóng thông báo" onClick={() => setNotificationsOpen(false)}>×</button></div>{notificationItems.length ? <div className="notification-list">{notificationItems.map((item, index) => <button className="notification-item" type="button" key={`${item.title}-${index}`} onClick={() => { setPage(item.page); setNotificationsOpen(false); }}><span className="notification-item-icon"><Bell size={15} /></span><span><strong>{item.title}</strong><small>{item.detail}</small></span><ArrowRight size={14} /></button>)}</div> : <p className="notification-empty">Hiện chưa có thông báo mới.</p>}</section>}</div><span className="top-divider" /><span className="top-user">{user.name}</span></div></header>
          <div className="page-content">
            {page === "overview" && <Dashboard role={user.role} artifacts={artifacts} tickets={tickets} employees={employees} tours={tours} analytics={analytics} museumSettings={museumSettings} navigate={setPage} />}
            {(page === "artifacts" || page === "approvals" || page === "catalog" || page === "conservation") && <ArtifactWorkspace role={user.role} page={page} artifacts={displayedArtifacts} query={query} setQuery={setQuery} onCreate={createArtifact} onReview={reviewArtifact} onConservation={logConservation} />}
            {page === "employees" && <EmployeeWorkspace employees={employees} onCreate={createEmployee} />}
            {page === "scan" && <ScannerWorkspace scanCode={scanCode} setScanCode={setScanCode} scanResult={scanResult} onSubmit={validateTicket} />}
            {page === "tours" && <TourWorkspace tours={tours} onCreate={createTour} />}
            {page === "tickets" && <TicketWorkspace tickets={tickets} ticketPriceVnd={museumSettings.ticketPriceVnd} openingTime={museumSettings.openingTime} closingTime={museumSettings.closingTime} paymentMode={museumSettings.paymentMode} onSubmit={buyTicket} />}
            {page === "map" && <MapWorkspace />}
            {page === "route" && <RouteWorkspace minutes={routeMinutes} setMinutes={setRouteMinutes} interests={interests} setInterests={setInterests} route={route} onSuggest={suggestRoute} />}
            {page === "visual" && <VisualWorkspace imagePreview={imagePreview} setImagePreview={setImagePreview} cameraOn={cameraOn} setCameraOn={setCameraOn} videoRef={videoRef} />}
            {page === "settings" && <SettingsWorkspace />}
          </div>
        </section>
      </div>
      {user.role === "CUSTOMER" && <CustomerChatBubble />}
      {showLogoutConfirm && (
        <div className="logout-confirm-backdrop" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-confirm-modal" onClick={(event) => event.stopPropagation()}>
            <div className="logout-confirm-icon"><LogOut size={30} strokeWidth={2.5} /></div>
            <h3>Xác nhận đăng xuất</h3>
            <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?</p>
            <div className="logout-confirm-actions">
              <button type="button" className="button-secondary logout-confirm-cancel" onClick={() => setShowLogoutConfirm(false)}>Hủy</button>
              <button type="button" className="button-primary logout-confirm-continue" onClick={async () => { setShowLogoutConfirm(false); await logout(); }}>Đăng xuất</button>
            </div>
          </div>
        </div>
      )}
      {notice && <div className={`toast-message ${noticeType}`} role={noticeType === "error" ? "alert" : "status"}>{noticeType === "error" ? <CircleAlert size={16} /> : noticeType === "info" ? <Info size={16} /> : <Check size={16} />}{notice}</div>}
    </main>
  );
}

function LoginScreen({ email, password, setEmail, setPassword, onLogin, error, busy, setError }: { email: string; password: string; setEmail: (value: string) => void; setPassword: (value: string) => void; onLogin: (event: FormEvent) => void; error: string; busy: boolean; setError: (value: string) => void }) {
  const hasDatabaseWarning = error.includes("DATABASE_URL") || error.includes("không thể kết nối cơ sở dữ liệu");
  return <main className="login-page"><section className="login-visual"><div className="brand-lockup light"><span className="brand-mark"><Landmark size={20} /></span><span><strong>MUSEA</strong><small>HERITAGE INTELLIGENCE</small></span></div><div className="login-art"><div className="art-ring ring-one" /><div className="art-ring ring-two" /><div className="artifact-emblem"><Landmark size={70} strokeWidth={1} /></div><span className="art-label">NATIONAL HERITAGE COLLECTION · EST. 1958</span></div><div className="login-manifesto"><span className="eyebrow gold-text">DI SẢN · NGHIÊN CỨU · KẾT NỐI</span><h1>Những câu chuyện<br />được gìn giữ <em>qua thời gian.</em></h1><p>Một không gian vận hành bảo tàng thống nhất, dành cho người giữ gìn và khám phá di sản.</p></div><div className="visual-footer"><span>HỆ THỐNG QUẢN LÝ BẢO TÀNG</span><span>01 / 03</span></div></section><section className="login-panel"><div className="login-box"><p className="eyebrow">CỔNG ĐĂNG NHẬP</p><h2>Chào mừng trở lại</h2><p className="muted">Đăng nhập bằng tài khoản bảo tàng của bạn.</p><form onSubmit={onLogin} className="login-form"><label>Email công việc<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Mật khẩu<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <p className={`form-error ${hasDatabaseWarning ? "database-alert" : ""}`}>{error}</p>}{hasDatabaseWarning && <div className="database-warning"><p>Nếu bạn muốn chạy với database thật,<br />hãy đảm bảo PostgreSQL đang chạy và<br />chỉnh đúng URL trong <strong>.env</strong>.</p><button type="button" className="button-primary wide database-warning-button" onClick={() => setError("")}><span>Đăng nhập</span><ArrowRight size={16} /></button></div>}{!hasDatabaseWarning && <button className="button-primary wide" disabled={busy}>{busy ? "Đang xác thực…" : "Đăng nhập"}<ArrowRight size={16} /></button>}</form><div className="demo-accounts"><span>TÀI KHOẢN DEMO</span><div>{demoAccounts.map((account) => <button key={account.role} onClick={() => { setEmail(account.email); setPassword("Musea@2026"); }}><b>{account.label}</b><small>{account.email}</small></button>)}</div><p>Mật khẩu demo: <b>Musea@2026</b></p></div><div className="login-legal"><ShieldCheck size={15} /> Phiên đăng nhập được bảo vệ bằng cookie HTTP-only.</div></div></section></main>;
}

function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="muted">{subtitle}</p></div>{action}</div>;
}

function Dashboard({ role, artifacts, tickets, employees, tours, analytics, museumSettings, navigate }: { role: Role; artifacts: Artifact[]; tickets: TicketRecord[]; employees: Employee[]; tours: Tour[]; analytics: Analytics | null; museumSettings: MuseumSettings; navigate: (page: string) => void }) {
  const pending = artifacts.filter((item) => item.status === "PENDING").length;
  const revenue = analytics?.ticketRevenueVnd ?? tickets.filter((ticket) => ticket.status !== "CANCELLED").reduce((sum, ticket) => sum + ticket.amountVnd, 0);
  const visitsToday = analytics?.visitsByDay.find((row) => row.date === new Date().toISOString().slice(0, 10))?.count ?? 0;
  const hourlyBars = (analytics?.visitsByHour ?? []).map((row) => ({ label: row.hour.slice(0, 2), value: row.count }));
  if (role === "CUSTOMER") return <TicketWorkspace tickets={tickets} ticketPriceVnd={museumSettings.ticketPriceVnd} openingTime={museumSettings.openingTime} closingTime={museumSettings.closingTime} paymentMode={museumSettings.paymentMode} onSubmit={() => undefined} />;
  if (role === "STAFF") return <><PageHeading eyebrow="CA TRỰC · HÔM NAY" title="Chào buổi sáng, đội ngũ bảo tàng" subtitle="Các tác vụ đang chờ trong ca làm việc của bạn." /><section className="metric-grid three"><Metric label="Vé chờ soát" value="18" note="Khách dự kiến trong giờ tới" icon={<QrCode />} trend="Từ hệ thống quét" /><Metric label="Hiện vật theo dõi" value={String(artifacts.filter((item) => item.status === "CONSERVATION").length).padStart(2, "0")} note="Cần cập nhật bảo tồn" icon={<ShieldCheck />} trend="Đang cần kiểm tra" /><Metric label="Tour trong ngày" value={String(tours.length).padStart(2, "0")} note="Lịch hướng dẫn đang mở" icon={<Compass />} trend="Đội hướng dẫn sẵn sàng" /></section><section className="dashboard-lower"><div className="panel-card"><div className="panel-title"><div><h2>Việc cần làm</h2><p>Truy cập nhanh các tác vụ trong ca</p></div></div><div className="task-list"><Task title="Quét vé tại cổng" detail="Xác nhận vé và chống dùng lại" icon={<QrCode />} action="scan" navigate={navigate} /><Task title="Cập nhật hồ sơ bảo tồn" detail="Ghi chú tình trạng hiện vật" icon={<ShieldCheck />} action="conservation" navigate={navigate} /><Task title="Xem lịch tour" detail="Kiểm tra giờ và hướng dẫn viên" icon={<Compass />} action="tours" navigate={navigate} /></div></div><div className="panel-card blue-panel"><span className="eyebrow">LƯU Ý VẬN HÀNH</span><h2>Ghi chép đầy đủ<br />mỗi lần bàn giao.</h2><p>Nhật ký bảo tồn gắn với người thực hiện và thời điểm cập nhật.</p><button className="button-ghost" onClick={() => navigate("conservation")}>Mở sổ bảo tồn <ArrowRight size={15} /></button></div></section></>;
  return <><PageHeading eyebrow="TỔNG QUAN VẬN HÀNH" title="Tổng quan vận hành" subtitle="Số liệu tổng hợp từ lượt vào cổng, vé và bộ sưu tập." action={<button className="button-secondary" onClick={() => navigate("artifacts")}><ImagePlus size={16} /> Thêm hiện vật</button>} /><section className="metric-grid"> <Metric label="Doanh thu ghi nhận" value={money(revenue)} note="Từ vé đã thanh toán" icon={<CreditCard />} trend="30 ngày gần nhất" /><Metric label="Khách tham quan hôm nay" value={visitsToday.toLocaleString("vi-VN")} note="Lượt vào cổng được ghi nhận" icon={<Users />} trend={analytics ? "Dữ liệu lượt vào" : "Đang tải dữ liệu"} /><Metric label="Hồ sơ hiện vật" value={String(artifacts.length).padStart(2, "0")} note={`${pending} hồ sơ cần phê duyệt`} icon={<Landmark />} trend={pending ? `${pending} chờ duyệt` : "Đã đồng bộ"} /><Metric label="Nhân sự hoạt động" value={String(employees.length).padStart(2, "0")} note="Tài khoản quản trị và nhân viên" icon={<Activity />} trend="Đang trực" /></section><section className="dashboard-lower"><div className="panel-card chart-panel"><div className="panel-title"><div><h2>Lượt khách theo khung giờ</h2><p>Phân bố từ lượt vào cổng được ghi nhận</p></div><span className="period-tag">HÔM NAY <ChevronDown size={14} /></span></div><div className="chart-legend"><span><i /> Lượt vào cổng</span><small>{analytics?.totalVisits ?? 0} lượt trong 30 ngày</small></div><div className="bar-chart">{hourlyBars.map((bar) => <div className="bar-column" key={bar.label}><span style={{ height: `${Math.max(4, Math.round(bar.value * 100 / Math.max(1, ...hourlyBars.map((item) => item.value))))}%` }} /><small>{bar.label}:00</small></div>)}</div></div><div className="panel-card"><div className="panel-title"><div><h2>Phê duyệt hiện vật</h2><p>Hồ sơ gửi bởi nhân viên</p></div><button className="text-link" onClick={() => navigate("approvals")}>Xem hàng đợi <ArrowRight size={14} /></button></div>{pending ? <div className="review-callout"><span className="gold-icon"><BadgeCheck size={18} /></span><div><strong>{pending} hồ sơ chờ xử lý</strong><small>Kiểm tra nguồn gốc và thông tin trưng bày</small></div><button className="arrow-action" onClick={() => navigate("approvals")}><ArrowRight size={16} /></button></div> : <div className="empty-state compact">Không có hồ sơ chờ duyệt.</div>}<div className="mini-stat-row"><span>Nhân sự trong hệ thống</span><b>{employees.length}</b></div><div className="mini-stat-row"><span>Vé trong cơ sở dữ liệu</span><b>{analytics?.ticketCount ?? tickets.length}</b></div><div className="mini-stat-row"><span>Triển lãm đang mở</span><b>{analytics?.activeExhibitions ?? 0}</b></div></div></section></>;
}

function Metric({ label, value, note, icon, trend }: { label: string; value: string; note: string; icon: React.ReactNode; trend: string }) {
  return <article className="metric-card"><div className="metric-top"><span className="metric-icon">{icon}</span><span className="metric-trend">{trend}</span></div><span className="metric-label">{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function Task({ title, detail, icon, action, navigate }: { title: string; detail: string; icon: React.ReactNode; action: string; navigate: (page: string) => void }) {
  return <button className="task-row" onClick={() => navigate(action)}><span className="task-icon">{icon}</span><span><strong>{title}</strong><small>{detail}</small></span><ArrowRight size={16} /></button>;
}

function ArtifactWorkspace({ role, page, artifacts, query, setQuery, onCreate, onReview, onConservation }: { role: Role; page: string; artifacts: Artifact[]; query: string; setQuery: (query: string) => void; onCreate: (event: FormEvent<HTMLFormElement>) => void; onReview: (artifact: Artifact, status: "APPROVED" | "REJECTED") => void; onConservation: (artifact: Artifact) => void }) {
  const approval = page === "approvals";
  const customer = role === "CUSTOMER" || page === "catalog";
  const staffConservation = page === "conservation";
  const title = approval ? "Phê duyệt hiện vật" : staffConservation ? "Theo dõi bảo tồn" : customer ? "Tra cứu bộ sưu tập" : role === "STAFF" ? "Đề xuất hiện vật mới" : "Hiện vật & bộ sưu tập";
  const subtitle = approval ? "Rà soát hồ sơ do nhân viên gửi lên trước khi đưa vào danh mục công khai." : customer ? "Tìm hiểu hiện vật, chất liệu và bối cảnh lịch sử trong bộ sưu tập." : role === "STAFF" ? "Gửi thông tin hiện vật để quản trị viên xem xét và phê duyệt." : "Quản lý thông tin, trạng thái trưng bày và lịch sử bảo tồn.";
  return <><PageHeading eyebrow={customer ? "KHÁM PHÁ DI SẢN" : "BỘ SƯU TẬP QUỐC GIA"} title={title} subtitle={subtitle} /><div className="toolbar-row"><label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên, mã, thời kỳ, loại hình…" /></label><span className="result-count">{artifacts.length} hồ sơ</span></div>{role !== "CUSTOMER" && !approval && !staffConservation && <form className="inline-create panel-card" onSubmit={onCreate}><h3>Thêm hồ sơ hiện vật</h3><div className="form-grid compact-grid"><input name="code" placeholder="Mã hiện vật" required /><input name="name" placeholder="Tên hiện vật" required /><input name="period" placeholder="Thời kỳ" required /><input name="year" placeholder="Niên đại" required /><input name="category" placeholder="Loại hình" required /><input name="imageUrl" type="url" placeholder="URL hình ảnh (tùy chọn)" /><textarea name="description" placeholder="Mô tả hiện vật" required /></div><button className="button-primary" type="submit"><ImagePlus size={15} />{role === "STAFF" ? "Gửi duyệt" : "Thêm vào bộ sưu tập"}</button></form>}{approval && artifacts.length === 0 ? <div className="panel-card empty-state">Không có hồ sơ chờ phê duyệt.</div> : <div className={`artifact-grid ${customer ? "public-grid" : ""}`}>{artifacts.map((artifact) => <article className="artifact-card" key={artifact.id}><div className="artifact-art"><span className="artifact-category">{artifact.category}</span>{artifact.imageUrl ? <img src={artifact.imageUrl} alt="" /> : <Landmark size={40} strokeWidth={1} />}<span className={`status-pill ${artifact.status.toLowerCase()}`}>{statusNames[artifact.status] || artifact.status}</span></div><div className="artifact-body"><div className="artifact-code">{artifact.code} · {artifact.period}</div><h3>{artifact.name}</h3><p>{artifact.description}</p><div className="artifact-meta"><span>Niên đại</span><strong>{artifact.year}</strong></div>{approval && <div className="button-row"><button className="button-primary small" onClick={() => onReview(artifact, "APPROVED")}><Check size={14} />Duyệt</button><button className="button-danger" onClick={() => onReview(artifact, "REJECTED")}>Từ chối</button></div>}{staffConservation && <button className="button-secondary full-width" onClick={() => onConservation(artifact)}><ShieldCheck size={15} />Ghi nhật ký bảo tồn</button>}</div></article>)}</div>}</>;
}

function EmployeeWorkspace({ employees, onCreate }: { employees: Employee[]; onCreate: (event: FormEvent<HTMLFormElement>) => void }) {
  return <><PageHeading eyebrow="QUẢN TRỊ TRUY CẬP" title="Nhân sự & phân quyền" subtitle="Tạo tài khoản và xem vai trò được gán cho từng thành viên." /><div className="split-layout"><form className="panel-card form-stack" onSubmit={onCreate}><div className="panel-title"><div><h2>Tạo tài khoản nhân sự</h2><p>ADMIN hoặc STAFF · mật khẩu ít nhất 10 ký tự</p></div><Users size={18} /></div><label>Họ và tên<input name="name" required minLength={2} /></label><label>Email<input name="email" type="email" required /></label><label>Mật khẩu tạm thời<input name="password" type="password" minLength={10} required /></label><label>Vai trò<select name="role"><option value="STAFF">Nhân viên</option><option value="ADMIN">Quản trị viên</option></select></label><button className="button-primary" type="submit"><Users size={15} />Tạo tài khoản</button></form><div className="panel-card"><div className="panel-title"><div><h2>Danh sách nhân sự</h2><p>{employees.length} tài khoản nội bộ</p></div><span className="number-badge">{employees.length}</span></div><div className="employee-list">{employees.map((employee) => <div className="employee-row" key={employee.id}><span className="avatar small-avatar">{employee.name.split(" ").slice(-2).map((part) => part[0]).join("")}</span><span><strong>{employee.name}</strong><small>{employee.email}</small></span><span className="role-pill">{roleNames[employee.role]}</span></div>)}</div></div></div></>;
}

function ScannerWorkspace({ scanCode, setScanCode, scanResult, onSubmit }: { scanCode: string; setScanCode: (value: string) => void; scanResult: string; onSubmit: (event: FormEvent) => void }) {
  return <><PageHeading eyebrow="CỔNG ĐÓN KHÁCH" title="Kiểm tra vé vào cổng" subtitle="Quét QR bằng thiết bị tương thích hoặc nhập mã vé để xác thực." /><div className="scanner-layout"><div className="scanner-view"><div className="scanner-corner top-left" /><div className="scanner-corner top-right" /><div className="scanner-corner bottom-left" /><div className="scanner-corner bottom-right" /><div className="scan-symbol"><QrCode size={66} strokeWidth={1.2} /></div><span className="scan-line" /><p>VÙNG QUÉT MÃ QR</p><small>Camera scanner có thể kết nối tại cổng</small></div><form className="panel-card scanner-form" onSubmit={onSubmit}><span className="gold-icon large"><Ticket size={22} /></span><h2>Nhập mã vé</h2><p>Vé chỉ được ghi nhận một lần và phải có hiệu lực trong ngày.</p><label>Mã vé<input value={scanCode} onChange={(event) => setScanCode(event.target.value)} placeholder="MUS-XXXXXXXX" required /></label><button className="button-primary wide" type="submit"><ShieldCheck size={16} />Xác thực vé</button>{scanResult && <div className={`scan-result ${scanResult.startsWith("Vé ") ? "success" : "failure"}`}>{scanResult}</div>}<small className="form-footnote">API sẽ đánh dấu vé đã sử dụng kèm nhân viên và thời gian quét.</small></form></div></>;
}

function TourWorkspace({ tours, onCreate }: { tours: Tour[]; onCreate: (event: FormEvent<HTMLFormElement>) => void }) {
  return <><PageHeading eyebrow="ĐIỀU PHỐI HƯỚNG DẪN" title="Lịch tour bảo tàng" subtitle="Theo dõi hướng dẫn viên, thời lượng và sức chứa tour." /><div className="split-layout"><form className="panel-card form-stack" onSubmit={onCreate}><div className="panel-title"><div><h2>Tạo lịch tour</h2><p>Điều phối ca hướng dẫn tiếp theo</p></div><Compass size={18} /></div><label>Tên tour<input name="title" placeholder="Dấu ấn Đông Sơn" required /></label><div className="field-pair"><label>Ngày<input name="date" type="date" required /></label><label>Giờ<input name="time" type="time" required /></label></div><div className="field-pair"><label>Thời lượng (phút)<input name="durationMins" type="number" min="15" max="240" defaultValue="60" required /></label><label>Sức chứa<input name="capacity" type="number" min="1" max="50" defaultValue="15" required /></label></div><label>Các điểm tham quan<input name="route" placeholder="Đông Sơn, Trống đồng Ngọc Lũ" required /></label><button className="button-primary" type="submit"><Compass size={15} />Lưu lịch tour</button></form><div className="panel-card"><div className="panel-title"><div><h2>Lịch sắp tới</h2><p>{tours.length} tour được lập lịch</p></div><Clock3 size={18} /></div><div className="tour-list">{tours.map((tour) => <article className="tour-row" key={tour.id}><div className="tour-time"><strong>{new Date(tour.startsAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</strong><small>{new Date(tour.startsAt).toLocaleDateString("vi-VN")}</small></div><div><strong>{tour.title}</strong><small>{tour.durationMins} phút · Tối đa {tour.capacity} khách · {tour.guide?.name || "Chưa phân hướng dẫn viên"}</small><span>{tour.route.join(" → ")}</span></div></article>)}{tours.length === 0 && <div className="empty-state">Chưa có lịch tour. Tạo tour đầu tiên ở biểu mẫu bên cạnh.</div>}</div></div></div></>;
}

function TicketWorkspace({ tickets, ticketPriceVnd, openingTime, closingTime, paymentMode, onSubmit }: { tickets: TicketRecord[]; ticketPriceVnd: number; openingTime: string; closingTime: string; paymentMode: "demo" | "vnpay"; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(null);
  const startHour = Number(openingTime.slice(0, 2));
  const closeHour = Number(closingTime.slice(0, 2));
  const visitSlots = Array.from({ length: Math.max(0, Math.ceil((closeHour - startHour) / 2)) }, (_, index) => {
    const start = startHour + index * 2;
    const end = Math.min(start + 2, closeHour);
    return { start: `${String(start).padStart(2, "0")}:00`, end: `${String(end).padStart(2, "0")}:00` };
  });

  useEffect(() => {
    if (!selectedTicket) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedTicket(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedTicket]);

  return (
    <>
      <PageHeading
        eyebrow="VÉ ĐIỆN TỬ · ĐẶT TRƯỚC"
        title="Một ngày giữa di sản"
        subtitle="Chọn ngày tham quan, đặt vé và lưu mã QR trong tài khoản của bạn."
        action={<span className="secure-note"><ShieldCheck size={15} /> Đặt vé an toàn</span>}
      />
      <div className="ticket-layout">
        <form className="panel-card ticket-form" onSubmit={onSubmit}>
          <div className="section-marker">
            <span>01</span>
            <div><strong>Lịch tham quan</strong><small>Vé tiêu chuẩn · {money(ticketPriceVnd)} mỗi khách</small></div>
          </div>
          <div className="field-pair">
            <label>Ngày tham quan<input name="visitDate" type="date" min={new Date().toISOString().slice(0, 10)} required /></label>
            <label>Khung giờ<select name="visitTime">{visitSlots.map((slot) => <option key={slot.start} value={slot.start}>{slot.start} — {slot.end}</option>)}</select></label>
          </div>
          <div className="section-marker second">
            <span>02</span>
            <div><strong>Thông tin nhận vé</strong><small>Mã vé được lưu trong tài khoản khách hàng</small></div>
          </div>
          <label>Họ và tên<input name="visitorName" defaultValue="" placeholder="Nguyễn Văn A" required /></label>
          <label>Email<input name="visitorEmail" type="email" placeholder="email@example.com" required /></label>
          <label>Số lượng vé<select name="quantity"><option value="1">1 người</option><option value="2">2 người</option><option value="3">3 người</option><option value="4">4 người</option></select></label>
          <div className="payment-method">
            <span className="payment-method-icon"><CreditCard size={18} /></span>
            <span className="payment-method-copy"><strong>{paymentMode === "demo" ? "Thanh toán mô phỏng" : "Thanh toán qua VNPay"}</strong><small>{paymentMode === "demo" ? "Xác nhận giả lập · không thu tiền thật" : "Thẻ ngân hàng, ứng dụng hoặc VNPay-QR"}</small></span>
            <span className="payment-sandbox">{paymentMode === "demo" ? "DEMO" : "SANDBOX"}</span>
          </div>
          <button className="button-primary wide" type="submit"><CreditCard size={16} />Tiếp tục thanh toán</button>
          <small className="form-footnote">{paymentMode === "demo" ? "Vé có hiệu lực sau khi bạn xác nhận ở màn hình thanh toán demo." : "Vé chỉ có hiệu lực sau khi VNPay xác nhận giao dịch."}</small>
        </form>
        <aside className="ticket-aside">
          <div className="ticket-feature">
            <div className="feature-top"><Landmark size={18} /><span>QUỐC BẢO · VĂN HÓA ĐÔNG SƠN</span></div>
            <div className="feature-illustration"><div className="sun-disc" /><div className="drum-disc"><span>✦</span><i /><i /><i /></div></div>
            <div className="feature-copy"><span>TRẢI NGHIỆM ĐẶC SẮC</span><h2>Dấu ấn<br /><em>nghìn năm.</em></h2><p>Khám phá trống đồng Ngọc Lũ và những câu chuyện của người Việt cổ.</p></div>
          </div>
          <div className="panel-card ticket-history">
            <div className="panel-title"><div><h2>Vé của tôi</h2><p>{tickets.length} vé trong tài khoản</p></div><Ticket size={18} /></div>
            {tickets.map((ticket) => ticket.status === "VALID" || ticket.status === "USED" ? (
              <button
                className="owned-ticket"
                key={ticket.id}
                type="button"
                aria-label={`Hiển thị mã QR vé ${ticket.code}`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <span className="ticket-stub"><QrCode size={22} /></span>
                <span><strong>{ticket.code}</strong><small>{dateText(ticket.visitAt)} · {ticket.quantity} khách</small></span>
                <b>{statusNames[ticket.status]}</b>
              </button>
            ) : (
              <div className={`owned-ticket ${ticket.status === "PENDING_PAYMENT" ? "pending-ticket" : "cancelled-ticket"}`} key={ticket.id}>
                <span className="ticket-stub">{ticket.status === "PENDING_PAYMENT" ? <Clock3 size={20} /> : <X size={20} />}</span>
                <span><strong>{ticket.code}</strong><small>{dateText(ticket.visitAt)} · {ticket.quantity} khách</small></span>
                <b>{statusNames[ticket.status]}</b>
              </div>
            ))}
          </div>
        </aside>
      </div>
      {selectedTicket && (
        <div className="ticket-qr-backdrop" onClick={() => setSelectedTicket(null)}>
          <section
            className="ticket-qr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-qr-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="icon-quiet ticket-qr-close" type="button" aria-label="Đóng mã QR" onClick={() => setSelectedTicket(null)}><X size={18} /></button>
            <span className="eyebrow">VÉ ĐIỆN TỬ</span>
            <h2 id="ticket-qr-title">Mã QR vào cổng</h2>
            <div className="ticket-qr-code"><QRCodeSVG value={selectedTicket.code} size={220} level="M" includeMargin /></div>
            <strong className="ticket-qr-number">{selectedTicket.code}</strong>
            <p>{dateText(selectedTicket.visitAt)} · {selectedTicket.quantity} khách</p>
            <small>Đưa mã này cho nhân viên tại cổng để xác thực vé.</small>
          </section>
        </div>
      )}
    </>
  );
}

function MapWorkspace() {
  const zones = [{ name: "Đông Sơn", className: "zone-east", detail: "Trống đồng Ngọc Lũ" }, { name: "Champa", className: "zone-south", detail: "Điêu khắc đá" }, { name: "Triều Nguyễn", className: "zone-west", detail: "Mộc bản & tư liệu" }, { name: "Gốm cổ", className: "zone-north", detail: "Gốm sứ Việt Nam" }];
  return <><PageHeading eyebrow="DẪN LỐI TRONG BẢO TÀNG" title="Bản đồ trưng bày" subtitle="Sơ đồ minh họa các khu trưng bày. Hỏi nhân viên để được chỉ đường tại chỗ." /><div className="map-layout"><div className="museum-map"><div className="map-grid-lines" />{zones.map((zone) => <button key={zone.name} className={`map-zone ${zone.className}`}><span className="map-pin"><Landmark size={15} /></span><strong>{zone.name}</strong><small>{zone.detail}</small></button>)}<div className="map-entry"><ArrowRight size={16} /> CỔNG VÀO</div><div className="map-corridor corridor-one" /><div className="map-corridor corridor-two" /></div><aside className="panel-card map-legend"><span className="eyebrow">SƠ ĐỒ TẦNG 1</span><h2>Không gian di sản</h2><p>Bản đồ hướng dẫn minh họa, không thay thế sơ đồ thoát hiểm chính thức.</p>{zones.map((zone, index) => <div className="legend-row" key={zone.name}><span>0{index + 1}</span><div><strong>{zone.name}</strong><small>{zone.detail}</small></div><ArrowRight size={14} /></div>)}</aside></div></>;
}

function RouteWorkspace({ minutes, setMinutes, interests, setInterests, route, onSuggest }: { minutes: number; setMinutes: (minutes: number) => void; interests: string[]; setInterests: (interests: string[]) => void; route: { name: string; duration: number }[]; onSuggest: () => void }) {
  const options = ["Lịch sử", "Khảo cổ", "Nghệ thuật", "Điêu khắc", "Gốm sứ", "Tư liệu", "Tôn giáo"];
  const toggle = (item: string) => setInterests(interests.includes(item) ? interests.filter((interest) => interest !== item) : [...interests, item]);
  return <><PageHeading eyebrow="MUSEAI · CÁ NHÂN HÓA" title="Lộ trình theo sở thích" subtitle="Chọn quỹ thời gian và chủ đề bạn quan tâm để sắp xếp các điểm dừng." /><div className="route-layout"><section className="panel-card route-controls"><div className="panel-title"><div><h2>Điều bạn muốn khám phá</h2><p>Chọn nhiều chủ đề phù hợp</p></div><Sparkles size={19} /></div><div className="interest-tags">{options.map((item) => <button key={item} className={interests.includes(item) ? "selected" : ""} onClick={() => toggle(item)}>{interests.includes(item) && <Check size={13} />}{item}</button>)}</div><label className="range-label">Thời gian tham quan <strong>{minutes} phút</strong></label><input className="time-range" type="range" min="30" max="240" step="15" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} /><div className="range-scale"><span>30 phút</span><span>4 giờ</span></div><button className="button-primary wide" onClick={onSuggest}><Sparkles size={16} />Gợi ý lộ trình</button><small className="form-footnote">Lộ trình gợi ý hiện dùng thuật toán mẫu theo chủ đề và thời lượng.</small></section><section className="panel-card route-result"><div className="panel-title"><div><span className="eyebrow">GỢI Ý CHO BẠN</span><h2>Hành trình khám phá</h2></div><Compass size={19} /></div>{route.length ? <><div className="route-stops">{route.map((stop, index) => <div className="route-stop" key={stop.name}><span className="stop-number">0{index + 1}</span><div><strong>{stop.name}</strong><small>{stop.duration} phút · Thời gian trải nghiệm</small></div><span>{index ? <ArrowDownRight size={15} /> : <Map size={15} />}</span></div>)}</div><div className="route-total"><span>TỔNG THỜI GIAN</span><strong>{route.reduce((total, stop) => total + stop.duration, 0)} phút</strong></div></> : <div className="route-empty"><span><Compass size={28} /></span><strong>Chuyến đi bắt đầu từ đây</strong><p>Chọn sở thích và để MuseAI sắp xếp các điểm dừng phù hợp.</p></div>}</section></div></>;
}

function VisualWorkspace({ imagePreview, setImagePreview, cameraOn, setCameraOn, videoRef }: { imagePreview: string; setImagePreview: (url: string) => void; cameraOn: boolean; setCameraOn: (value: boolean) => void; videoRef: React.RefObject<HTMLVideoElement | null> }) {
  return <><PageHeading eyebrow="AI VISUAL SEARCH · BẢN THỬ NGHIỆM" title="Nhận diện hiện vật qua hình ảnh" subtitle="Tải ảnh hoặc mở camera để xem trước luồng nhận diện. Kết quả hiện là mockup giao diện." /><div className="visual-search-layout"><div className="visual-dropzone">{cameraOn ? <video ref={videoRef} autoPlay playsInline muted className="camera-preview" /> : imagePreview ? <img className="upload-preview" src={imagePreview} alt="Ảnh hiện vật tải lên" /> : <div className="upload-empty"><span><ImagePlus size={28} /></span><strong>Đưa hình ảnh hiện vật vào đây</strong><small>JPG, PNG hoặc WEBP · tối đa 10 MB</small></div>}<div className="upload-actions"><label className="button-secondary"><ImagePlus size={15} />Tải ảnh<input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) setImagePreview(URL.createObjectURL(file)); setCameraOn(false); }} /></label><button className="button-secondary" onClick={() => { setImagePreview(""); setCameraOn(!cameraOn); }}><Camera size={15} />{cameraOn ? "Tắt camera" : "Mở camera"}</button></div></div><aside className="panel-card visual-result"><span className="gold-icon large"><Sparkles size={21} /></span><span className="eyebrow">KẾT QUẢ NHẬN DIỆN</span><h2>{imagePreview || cameraOn ? "Đã nhận hình ảnh" : "Sẵn sàng phân tích"}</h2><p>{imagePreview || cameraOn ? "Mockup gợi ý: hiện vật có thể thuộc nhóm gốm sứ hoặc điêu khắc. Mô hình thị giác chưa được kết nối." : "Chọn một hình ảnh để xem trạng thái và gợi ý nhận diện mẫu."}</p><div className="confidence-track"><span><i style={{ width: imagePreview || cameraOn ? "72%" : "0%" }} /></span><small>Độ tin cậy mockup <b>{imagePreview || cameraOn ? "72%" : "—"}</b></small></div><button className="button-primary wide" disabled={!imagePreview && !cameraOn}><Search size={15} />Tra cứu trong bộ sưu tập</button><small className="form-footnote">Không tải ảnh lên server ở bản demo này.</small></aside></div></>;
}

function SettingsWorkspace() {
  return <><PageHeading eyebrow="THIẾT LẬP NỀN TẢNG" title="Cấu hình hệ thống" subtitle="Các mục vận hành và tích hợp cho môi trường triển khai." /><div className="settings-grid">{[{ icon: <ShieldCheck />, title: "Chính sách truy cập", text: "Role kiểm tra phía API · session cookie HTTP-only", value: "ĐANG BẬT" }, { icon: <CreditCard />, title: "Thanh toán vé", text: "Cấu hình cổng thanh toán được cấp phép", value: "CHƯA KẾT NỐI" }, { icon: <Sparkles />, title: "Nhà cung cấp AI", text: "OpenAI-compatible provider qua API server", value: process.env.NEXT_PUBLIC_AI_READY === "true" ? "ĐÃ CẤU HÌNH" : "DÙNG DỮ LIỆU MẪU" }, { icon: <Activity />, title: "Cơ sở dữ liệu", text: "PostgreSQL qua Prisma ORM", value: "POSTGRESQL" }].map((item) => <article className="settings-item" key={item.title}><span className="settings-icon">{item.icon}</span><div><strong>{item.title}</strong><p>{item.text}</p><small>{item.value}</small></div><ChevronDown size={16} /></article>)}</div><div className="security-banner"><ShieldCheck size={20} /><div><strong>Bảo vệ API ở server</strong><p>Giao diện không phải ranh giới bảo mật. Mọi thao tác quản trị được xác thực lại ở route handler.</p></div></div></>;
}

