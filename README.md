# MUSEA — Hệ thống quản lý bảo tàng có tích hợp AI

Prototype giao diện quản trị bảo tàng chạy độc lập bằng HTML, CSS và JavaScript thuần.

## Bản full-stack

Mã nguồn Next.js, TypeScript, Tailwind CSS và PostgreSQL/Prisma nằm trong thư mục [`museum-platform/`](museum-platform/README.md). Bản này bổ sung phân quyền ADMIN/STAFF/CUSTOMER, API, chatbot MuseAI và các giao diện vận hành; prototype HTML phía dưới được giữ nguyên.

## Chạy dự án

Mở trực tiếp `index.html` trong trình duyệt. Không cần cài dependency hay backend.

## Thành phần chính

- Dashboard tổng quan với KPI, biểu đồ khách tham quan và hoạt động gần đây.
- Quản lý hiện vật với tìm kiếm, lọc trạng thái và thêm hiện vật mới.
- Quản lý triển lãm, khách tham quan và phân tích dữ liệu.
- Trợ lý MuseAI mô phỏng các truy vấn tự nhiên về bộ sưu tập.
- Khách tham quan có thể thanh toán vé online bằng MoMo, VNPay hoặc thẻ ngân hàng mô phỏng và xem lịch sử giao dịch.
- Luồng đặt vé online được nối trực tiếp với thanh toán: vé mới sẽ được giữ chỗ, chuyển sang màn hình thanh toán và chỉ ghi vào lịch sử sau khi thanh toán thành công.
- `db.json` là dữ liệu seed, có thể dùng làm hợp đồng dữ liệu để nối SQLite/PostgreSQL/API sau này.

## Tài khoản demo

- Quản trị viên: `admin@musea.vn` / `Musea@2026` — toàn quyền quản lý.
- Khách tham quan: `guest@musea.vn` / `Guest@2026` — xem tổng quan, khách tham quan, triển lãm và MuseAI.

Màn hình đăng nhập có chọn vai trò, kiểm tra thông tin, hiện/ẩn mật khẩu và nút đăng xuất. Phân quyền hiện đang chạy ở lớp giao diện prototype; khi nối backend cần lặp lại kiểm tra quyền ở API.

Thanh toán hiện là luồng mô phỏng trên trình duyệt. Khi triển khai thật cần thay bằng API của MoMo/VNPay/cổng thẻ, webhook xác nhận giao dịch và không lưu thông tin thẻ nhạy cảm ở frontend.

## Gợi ý nâng cấp production

Tách dữ liệu trong `db.json` thành các bảng `artifacts`, `exhibitions`, `visitors`, `loans`, `ai_insights` và kết nối API xác thực người dùng.
