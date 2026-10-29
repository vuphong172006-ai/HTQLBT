import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { user, response } = await requireRole(Role.ADMIN, Role.STAFF);
  if (response) return response;
  const parsed = z.object({ visitorName: z.string().trim().min(2).max(120).optional(), count: z.number().int().min(1).max(500).default(1) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Thông tin lượt khách chưa hợp lệ." }, { status: 400 });
  try {
    const visits = await prisma.visitorVisit.createMany({
      data: Array.from({ length: parsed.data.count }, () => ({ visitorName: parsed.data.visitorName, source: "WALK_IN", recordedById: user?.id })),
    });
    return Response.json({ recorded: visits.count }, { status: 201 });
  } catch {
    return Response.json({ error: "Không thể ghi nhận lượt khách." }, { status: 503 });
  }
}
