import { ArtifactStatus, Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const artifactSchema = z.object({
  code: z.string().min(2).max(40), name: z.string().min(2).max(180), period: z.string().min(1),
  year: z.string().min(1), category: z.string().min(1), description: z.string().min(5), imageUrl: z.string().url().optional(),
});

export async function GET(request: Request) {
  const user = await requireRole(Role.ADMIN, Role.STAFF, Role.CUSTOMER);
  if (user.response) return user.response;
  const status = new URL(request.url).searchParams.get("status");
  const where = user.user?.role === Role.CUSTOMER ? { status: ArtifactStatus.APPROVED } : status && Object.values(ArtifactStatus).includes(status as ArtifactStatus) ? { status: status as ArtifactStatus } : undefined;
  try {
    const artifacts = await prisma.artifact.findMany({ where, orderBy: { updatedAt: "desc" }, include: { submittedBy: { select: { name: true } } } });
    return Response.json({ artifacts });
  } catch {
    return Response.json({ error: "Không thể tải hiện vật." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const { user, response } = await requireRole(Role.ADMIN, Role.STAFF);
  if (response) return response;
  if (!user) return Response.json({ error: "Unauthenticated" }, { status: 401 });
  const parsed = artifactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Thông tin hiện vật chưa hợp lệ.", details: parsed.error.flatten() }, { status: 400 });
  try {
    const artifact = await prisma.artifact.create({ data: { ...parsed.data, submittedById: user.id, status: user.role === Role.ADMIN ? ArtifactStatus.APPROVED : ArtifactStatus.PENDING, ...(user.role === Role.ADMIN ? { approvedById: user.id } : {}) } });
    return Response.json({ artifact }, { status: 201 });
  } catch {
    return Response.json({ error: "Không thể tạo hiện vật; mã có thể đã được sử dụng." }, { status: 409 });
  }
}

export async function PATCH(request: Request) {
  const { user, response } = await requireRole(Role.ADMIN, Role.STAFF);
  if (response) return response;
  if (!user) return Response.json({ error: "Unauthenticated" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = z.string().safeParse(body?.id);
  if (!id.success) return Response.json({ error: "Thiếu mã hiện vật." }, { status: 400 });

  try {
    if (user.role === Role.ADMIN && [ArtifactStatus.APPROVED, ArtifactStatus.REJECTED].includes(body?.status)) {
      const artifact = await prisma.artifact.update({ where: { id: id.data }, data: { status: body.status, approvedById: user.id } });
      return Response.json({ artifact });
    }
    if (user.role === Role.STAFF) {
      const update = z.object({ status: z.enum([ArtifactStatus.ON_DISPLAY, ArtifactStatus.CONSERVATION, ArtifactStatus.RESEARCH]), condition: z.string().min(2), note: z.string().min(3) }).safeParse(body);
      if (!update.success) return Response.json({ error: "Thông tin bảo tồn chưa hợp lệ." }, { status: 400 });
      const artifact = await prisma.artifact.update({ where: { id: id.data }, data: { status: update.data.status } });
      await prisma.conservationLog.create({ data: { artifactId: id.data, staffId: user.id, condition: update.data.condition, note: update.data.note } });
      return Response.json({ artifact });
    }
    return Response.json({ error: "Thao tác không được phép." }, { status: 403 });
  } catch {
    return Response.json({ error: "Không thể cập nhật hiện vật." }, { status: 404 });
  }
}
