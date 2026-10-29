import { Role } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { response } = await requireRole(Role.ADMIN, Role.STAFF);
  if (response) return response;
  const params = new URL(request.url).searchParams;
  const days = Math.min(90, Math.max(1, Number(params.get("days") || 30)));
  if (!Number.isInteger(days)) return Response.json({ error: "days phải là số nguyên từ 1 đến 90." }, { status: 400 });
  const since = new Date();
  since.setDate(since.getDate() - days);
  try {
    const [visits, tickets, exhibitionCount, artifactsByStatus] = await Promise.all([
      prisma.visitorVisit.findMany({ where: { visitedAt: { gte: since } }, select: { visitedAt: true } }),
      prisma.ticket.aggregate({ where: { status: { in: ["VALID", "USED"] }, createdAt: { gte: since } }, _sum: { amountVnd: true }, _count: true }),
      prisma.exhibition.count({ where: { active: true, endsAt: { gte: new Date() } } }),
      prisma.artifact.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);
    const byDay = new Map<string, number>();
    const byHour = new Map<string, number>();
    for (const visit of visits) {
      const day = visit.visitedAt.toISOString().slice(0, 10);
      const hour = `${String(visit.visitedAt.getHours()).padStart(2, "0")}:00`;
      byDay.set(day, (byDay.get(day) || 0) + 1);
      byHour.set(hour, (byHour.get(hour) || 0) + 1);
    }
    return Response.json({
      periodDays: days, totalVisits: visits.length, ticketCount: tickets._count,
      ticketRevenueVnd: tickets._sum.amountVnd ?? 0, activeExhibitions: exhibitionCount,
      visitsByDay: [...byDay].map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
      visitsByHour: [...byHour].map(([hour, count]) => ({ hour, count })).sort((a, b) => a.hour.localeCompare(b.hour)),
      artifactsByStatus: artifactsByStatus.map((row) => ({ status: row.status, count: row._count._all })),
    });
  } catch {
    return Response.json({ error: "Không thể tổng hợp số liệu vận hành." }, { status: 503 });
  }
}
