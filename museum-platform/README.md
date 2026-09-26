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
npx prisma migrate dev --name init
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

## Demo và production

Giao diện cung cấp các luồng demo cho dashboard admin, duyệt hiện vật/nhân sự, nhân viên quét vé và cập nhật bảo tồn, khách mua vé/tra cứu hiện vật/bản đồ, visual search camera mockup, gợi ý lộ trình và chat bubble. Các thao tác dữ liệu qua API được bảo vệ bằng session và role; hãy cấu hình HTTPS, secret mạnh, chống brute-force, logging, CSRF policy và thanh toán qua cổng chính thức trước khi triển khai. Camera chỉ xin quyền khi người dùng chủ động bật; nhận diện hình ảnh hiện đang là mockup.
