import { Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { response } = await requireRole(Role.ADMIN);
  if (response) return response;
  try {
    const employees = await prisma.user.findMany({ where: { role: { in: [Role.ADMIN, Role.STAFF] } }, select: { id: true, name: true, email: true, role: true, active: true, createdAt: true }, orderBy: { createdAt: "desc" } });
    return Response.json({ employees });
  } catch {
    return Response.json({ error: "Không thể tải danh sách nhân sự." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const { response } = await requireRole(Role.ADMIN);
  if (response) return response;
  const parsed = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(10), role: z.enum([Role.ADMIN, Role.STAFF]) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Thông tin nhân sự không hợp lệ; mật khẩu cần tối thiểu 10 ký tự." }, { status: 400 });
  try {
    const employee = await prisma.user.create({ data: { ...parsed.data, email: parsed.data.email.toLowerCase(), passwordHash: await hash(parsed.data.password, 12) }, select: { id: true, name: true, email: true, role: true, active: true } });
    return Response.json({ employee }, { status: 201 });
  } catch {
    return Response.json({ error: "Không thể tạo tài khoản; email có thể đã tồn tại." }, { status: 409 });
  }
}
