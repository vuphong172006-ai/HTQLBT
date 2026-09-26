import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { museumFacts } from "@/lib/museum-data";

const requestSchema = z.object({ minutes: z.number().int().min(30).max(300), interests: z.array(z.string()).min(1).max(6) });

const stops = [
  { name: "Không gian Đông Sơn", interests: ["Khảo cổ", "Lịch sử"], duration: 35 },
  { name: "Trống đồng Ngọc Lũ", interests: ["Khảo cổ", "Nghệ thuật"], duration: 20 },
  { name: "Điêu khắc Champa", interests: ["Điêu khắc", "Tôn giáo"], duration: 35 },
  { name: "Mộc bản triều Nguyễn", interests: ["Lịch sử", "Tư liệu"], duration: 25 },
  { name: "Không gian gốm cổ", interests: ["Gốm sứ", "Nghệ thuật"], duration: 25 },
];

export async function POST(request: Request) {
  const { response } = await requireRole(Role.ADMIN, Role.STAFF, Role.CUSTOMER);
  if (response) return response;
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Chọn thời lượng từ 30–300 phút và ít nhất một sở thích." }, { status: 400 });
  const selected = stops
    .map((stop) => ({ stop, score: stop.interests.filter((interest) => parsed.data.interests.includes(interest)).length }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score);
  const route = [];
  let remaining = parsed.data.minutes;
  for (const { stop } of selected) {
    if (stop.duration <= remaining) {
      route.push({ name: stop.name, duration: stop.duration });
      remaining -= stop.duration;
    }
  }
  if (route.length === 0) route.push({ name: "Không gian Đông Sơn", duration: Math.min(35, parsed.data.minutes) });
  return Response.json({ route, totalMinutes: route.reduce((sum, stop) => sum + stop.duration, 0), estimatedCrowd: museumFacts.visitorToday > 1000 ? "Đông vào đầu giờ chiều" : "Vừa phải" });
}
