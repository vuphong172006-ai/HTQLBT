import { PrismaClient, ArtifactStatus, Role, TicketStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Musea@2026", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@musea.vn" },
    update: {},
    create: { name: "Nguyễn Hà", email: "admin@musea.vn", passwordHash, role: Role.ADMIN },
  });
  const staff = await prisma.user.upsert({
    where: { email: "staff@musea.vn" },
    update: {},
    create: { name: "Trần Minh An", email: "staff@musea.vn", passwordHash, role: Role.STAFF },
  });
  const customer = await prisma.user.upsert({
    where: { email: "guest@musea.vn" },
    update: {},
    create: { name: "Lê Thu Hà", email: "guest@musea.vn", passwordHash, role: Role.CUSTOMER },
  });

  const artifactSeeds = [
    { code: "ART-0234", name: "Trống đồng Ngọc Lũ", period: "Đông Sơn", year: "TK III TCN", category: "Khảo cổ", description: "Trống đồng tiêu biểu của văn hóa Đông Sơn, nổi bật với hoa văn ngôi sao và đoàn người hóa trang.", status: ArtifactStatus.ON_DISPLAY },
    { code: "ART-0189", name: "Tượng Phật Đồng Dương", period: "Champa", year: "TK IX", category: "Điêu khắc", description: "Tác phẩm điêu khắc Phật giáo mang phong cách nghệ thuật Đồng Dương.", status: ArtifactStatus.CONSERVATION },
    { code: "ART-0456", name: "Mộc bản triều Nguyễn", period: "Nguyễn", year: "1802–1945", category: "Tư liệu", description: "Tư liệu khắc gỗ phản ánh lịch sử và hoạt động của triều Nguyễn.", status: ArtifactStatus.ON_DISPLAY },
    { code: "ART-0312", name: "Ấm tử sa Chu Nê", period: "Lê sơ", year: "TK XV", category: "Gốm sứ", description: "Ấm trà đất nung thể hiện kỹ thuật chế tác và thẩm mỹ gốm cổ.", status: ArtifactStatus.RESEARCH },
  ];
  for (const artifact of artifactSeeds) {
    await prisma.artifact.upsert({
      where: { code: artifact.code },
      update: {},
      create: { ...artifact, submittedById: admin.id, approvedById: admin.id },
    });
  }

  await prisma.ticket.upsert({
    where: { code: "MUS-968014" },
    update: {},
    create: {
      code: "MUS-968014", ownerId: customer.id, visitorName: customer.name,
      visitorEmail: customer.email, visitAt: new Date("2026-10-04T09:00:00+07:00"),
      quantity: 2, amountVnd: 160000, status: TicketStatus.VALID,
    },
  });

  const tourSeeds = [
    { title: "Dấu ấn Đông Sơn", startsAt: new Date("2026-10-04T09:30:00+07:00"), durationMins: 60, capacity: 15, guideId: staff.id, route: ["Trống đồng Ngọc Lũ", "Không gian Đông Sơn"] },
    { title: "Nghệ thuật Champa", startsAt: new Date("2026-10-04T14:00:00+07:00"), durationMins: 75, capacity: 12, guideId: staff.id, route: ["Điêu khắc Champa", "Tượng Phật Đồng Dương"] },
  ];
  for (const tour of tourSeeds) {
    await prisma.tour.upsert({ where: { title_startsAt: { title: tour.title, startsAt: tour.startsAt } }, update: {}, create: tour });
  }
}

main().finally(async () => prisma.$disconnect());
