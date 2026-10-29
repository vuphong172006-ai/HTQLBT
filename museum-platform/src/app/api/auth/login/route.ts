import { compare } from "bcryptjs";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { Role } from "@prisma/client";

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(1).max(128) });

const demoUsers = [
  { id: "demo-admin", name: "Quản trị viên", email: "admin@musea.vn", role: "ADMIN" as Role, password: "Musea@2026" },
  { id: "demo-staff", name: "Nhân viên bảo tàng", email: "staff@musea.vn", role: "STAFF" as Role, password: "Musea@2026" },
  { id: "demo-customer", name: "Khách tham quan", email: "guest@musea.vn", role: "CUSTOMER" as Role, password: "Musea@2026" },
];

export async function POST(request: Request) {
  const parsed = credentialsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Email hoặc mật khẩu không hợp lệ." }, { status: 400 });

  const normalizedEmail = parsed.data.email.toLowerCase();
  const demoUser = demoUsers.find((user) => user.email === normalizedEmail && user.password === parsed.data.password);
  if (!process.env.DATABASE_URL && demoUser) {
    const user = { id: demoUser.id, name: demoUser.name, email: demoUser.email, role: demoUser.role };
    await createSession(user);
    return Response.json({ user });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return Response.json({ error: "Không thể kết nối cơ sở dữ liệu. Hãy kiểm tra DATABASE_URL." }, { status: 503 });
    }

    const { prisma } = await import("@/lib/prisma");
    const account = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!account || !account.active || !(await compare(parsed.data.password, account.passwordHash))) {
      return Response.json({ error: "Email hoặc mật khẩu không chính xác." }, { status: 401 });
    }
    const user = { id: account.id, name: account.name, email: account.email, role: account.role };
    await createSession(user);
    return Response.json({ user });
  } catch {
    return Response.json({ error: "Không thể kết nối cơ sở dữ liệu. Hãy kiểm tra DATABASE_URL." }, { status: 503 });
  }
}
