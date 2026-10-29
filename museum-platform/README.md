# MUSEA Museum Platform

Nền tảng quản lý bảo tàng full-stack bằng Next.js App Router, TypeScript, Tailwind CSS, Prisma và PostgreSQL. Prototype HTML ở thư mục gốc được giữ nguyên.

## Yêu cầu

- Node.js 20+
- npm 10+
- PostgreSQL 15+

## Cài đặt và chạy

```bash
cd museum-platform
npm install
Copy-Item .env.example .env
# Chỉnh DATABASE_URL và AUTH_SECRET trong .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

Mở `http://localhost:3000`.

Tài khoản demo sau khi seed (mật khẩu chung `Musea@2026`):

- Admin: `admin@musea.vn`
- Staff: `staff@musea.vn`
- Customer: `guest@musea.vn`

## Kiến trúc

- `src/app`: giao diện Next.js và route handlers REST.
- `src/app/api/ai/chat`: API chatbot, dùng dữ liệu museum context; có thể thay service bằng provider LLM qua biến môi trường.
- `src/lib/auth.ts`: session JWT cookie `httpOnly`, xác thực role phía server.
- `prisma/schema.prisma`: PostgreSQL schema cho tài khoản, hiện vật, vé, tour, bảo tồn và hội thoại.
- `prisma/seed.ts`: dữ liệu demo và tài khoản ba vai trò.

### Dữ liệu vận hành

- Migration bổ sung cấu hình bảo tàng, triển lãm, đăng ký tour và lượt khách. Chạy `npx prisma migrate dev` rồi `npm run db:seed` để áp dụng.
- Seed tạo 10 hồ sơ hiện vật, 3 triển lãm, 3 tour sắp tới và 600 lượt khách tổng hợp được gắn `source=DEMO`. Các lượt này chỉ phục vụ giao diện thử nghiệm; lượt vào thực tế được ghi qua quét vé hoặc `POST /api/visits`.
- `GET /api/analytics?days=30` tổng hợp lượt vào theo ngày/giờ, doanh thu vé, số vé và trạng thái hiện vật.
- `GET/POST /api/exhibitions`, `GET/PUT /api/museum`, `POST /api/tours/:id/bookings` hỗ trợ tra cứu và quản lý dữ liệu bảo tàng, triển lãm và chỗ tour. Đăng ký tour kiểm tra sức chứa trong transaction.
- Giá vé, giờ mở cửa và thông tin địa điểm nằm trong `MuseumSettings`; API mua vé lấy giá từ cấu hình này.

## Demo và production

Giao diện cung cấp các luồng cho dashboard admin, duyệt hiện vật/nhân sự, nhân viên quét vé và cập nhật bảo tồn, khách mua vé/tra cứu hiện vật/bản đồ, visual search camera mockup, gợi ý lộ trình và chat bubble. Các thao tác dữ liệu qua API được bảo vệ bằng session và role; hãy cấu hình HTTPS, secret mạnh, chống brute-force, logging và CSRF policy trước khi triển khai. Camera chỉ xin quyền khi người dùng chủ động bật; nhận diện hình ảnh hiện đang là mockup.

### VNPay Sandbox

Khi trình diễn tại máy local, có thể đặt `PAYMENT_MODE=demo`. Luồng này mở màn hình xác nhận mô phỏng và cập nhật trạng thái vé trong database; không tạo giao dịch hoặc thu tiền thật. Chỉ dùng trong demo nội bộ. Để dùng cổng thật, bỏ chế độ demo và cấu hình merchant sandbox bên dưới.

Đăng ký tài khoản merchant sandbox VNPay và điền `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET` trong `.env` cục bộ. `VNPAY_PAYMENT_URL` dùng endpoint sandbox trong `.env.example`; đặt `VNPAY_RETURN_URL` theo domain chạy ứng dụng. Không commit merchant secret.

Trong cấu hình merchant VNPay, đăng ký IPN URL `https://<domain-cong-khai>/api/payments/vnpay/ipn`. IPN cần HTTPS và không thể gọi tới `localhost`; khi thử nghiệm local cần tunnel HTTPS. Vé chỉ chuyển sang hiệu lực khi IPN có chữ ký hợp lệ, đúng mã merchant và đúng số tiền. Return URL chỉ xác minh và hiển thị kết quả, không tự xác nhận thanh toán. Môi trường production cần endpoint và merchant keys production riêng.
