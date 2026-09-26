import { compare } from "bcryptjs";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(1).max(128) });

export async function POST(request: Request) {
  const parsed = credentialsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Email hoặc mật khẩu không hợp lệ." }, { status: 400 });

  try {
    const account = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
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
