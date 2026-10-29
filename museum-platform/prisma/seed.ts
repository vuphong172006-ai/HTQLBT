import { PrismaClient, ArtifactStatus, Role, TicketStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function dateAtOffset(days: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function main() {
  const passwordHash = await bcrypt.hash("Musea@2026", 12);
  const accounts = [
    { name: "Nguyễn Hà", email: "admin@musea.vn", role: Role.ADMIN },
    { name: "Trần Minh An", email: "staff@musea.vn", role: Role.STAFF },
    { name: "Lê Thu Hà", email: "guest@musea.vn", role: Role.CUSTOMER },
  ] as const;
  const [admin, staff, customer] = await Promise.all(accounts.map((account) => prisma.user.upsert({
    where: { email: account.email }, update: { name: account.name, role: account.role, active: true },
    create: { ...account, passwordHash },
  })));

  await prisma.museumSettings.upsert({
    where: { id: "museum" }, update: {},
    create: { id: "museum", name: "Bảo tàng Lịch sử Quốc gia", address: "1 Tràng Tiền", city: "Hà Nội", founded: 1958, openingTime: "08:00", closingTime: "17:00", ticketPriceVnd: 80000 },
  });

  const artifacts = [
    ["ART-0234", "Trống đồng Ngọc Lũ", "Đông Sơn", "TK III TCN", "Khảo cổ", "Trống đồng tiêu biểu của văn hóa Đông Sơn, nổi bật với hoa văn ngôi sao và đoàn người hóa trang.", ArtifactStatus.ON_DISPLAY],
    ["ART-0189", "Tượng Phật Đồng Dương", "Champa", "TK IX", "Điêu khắc", "Tác phẩm điêu khắc Phật giáo mang phong cách nghệ thuật Đồng Dương.", ArtifactStatus.CONSERVATION],
    ["ART-0456", "Mộc bản triều Nguyễn", "Nguyễn", "1802–1945", "Tư liệu", "Tư liệu khắc gỗ phản ánh lịch sử và hoạt động của triều Nguyễn.", ArtifactStatus.ON_DISPLAY],
    ["ART-0312", "Ấm tử sa Chu Nê", "Lê sơ", "TK XV", "Gốm sứ", "Ấm trà đất nung thể hiện kỹ thuật chế tác và thẩm mỹ gốm cổ.", ArtifactStatus.RESEARCH],
    ["ART-0520", "Trống đồng Đông Sơn", "Đông Sơn", "TK II TCN", "Khảo cổ", "Trống đồng với hoa văn hình học và cảnh sinh hoạt cộng đồng.", ArtifactStatus.ON_DISPLAY],
    ["ART-0678", "Tượng thần Shiva Champa", "Champa", "TK VIII", "Điêu khắc", "Tác phẩm điêu khắc đá Chăm thể hiện thần Shiva trong nghệ thuật Hindu giáo.", ArtifactStatus.CONSERVATION],
    ["ART-0741", "Tượng Phật đồng cổ", "Phù Nam", "TK VIII–IX", "Điêu khắc", "Tượng Phật bằng đồng cho thấy giao lưu văn hóa và tín ngưỡng cổ.", ArtifactStatus.ON_DISPLAY],
    ["ART-0815", "Mộc bản Ngự chế", "Nguyễn", "TK XIX", "Tư liệu", "Mộc bản lưu giữ văn thơ ngự chế và kỹ thuật in khắc triều Nguyễn.", ArtifactStatus.RESEARCH],
    ["ART-0933", "Ấm đất Nghi Hưng cổ", "Thanh", "TK XVIII", "Gốm sứ", "Ấm đất tử sa minh họa giao lưu gốm sứ khu vực Đông Á.", ArtifactStatus.ON_DISPLAY],
    ["ART-1042", "Phù điêu vũ nữ Apsara", "Champa", "TK X", "Điêu khắc", "Phù điêu vũ nữ Apsara với đường nét chuyển động đặc trưng nghệ thuật Champa.", ArtifactStatus.PENDING],
  ] as const;
  for (const [code, name, period, year, category, description, status] of artifacts) {
    await prisma.artifact.upsert({
      where: { code }, update: {},
      create: { code, name, period, year, category, description, status, submittedById: admin.id, ...(status !== ArtifactStatus.PENDING ? { approvedById: admin.id } : {}) },
    });
  }

  const exhibitions = [
    { slug: "dong-chay-van-lang", name: "Dòng chảy Văn Lang", description: "Hành trình khám phá nhà nước Văn Lang và đời sống cư dân Việt cổ qua hiện vật khảo cổ.", location: "Phòng trưng bày 1", startsAt: new Date("2026-06-12T08:00:00+07:00"), endsAt: new Date("2026-12-30T17:00:00+07:00") },
    { slug: "nghe-thuat-champa", name: "Nghệ thuật Champa", description: "Điêu khắc và tín ngưỡng Champa qua các tác phẩm đá, đồng và tư liệu lịch sử.", location: "Phòng trưng bày 2", startsAt: new Date("2026-03-03T08:00:00+07:00"), endsAt: new Date("2026-11-15T17:00:00+07:00") },
    { slug: "di-san-ky-uc", name: "Di sản Ký ức", description: "Mộc bản, tư liệu và câu chuyện về việc lưu giữ ký ức lịch sử qua nhiều thế hệ.", location: "Phòng trưng bày 3", startsAt: new Date("2026-08-22T08:00:00+07:00"), endsAt: new Date("2027-01-20T17:00:00+07:00") },
  ];
  for (const exhibition of exhibitions) await prisma.exhibition.upsert({ where: { slug: exhibition.slug }, update: exhibition, create: exhibition });

  await prisma.ticket.upsert({
    where: { code: "MUS-968014" },
    update: { visitAt: dateAtOffset(1, 9), status: TicketStatus.VALID, amountVnd: 160000, quantity: 2 },
    create: { code: "MUS-968014", ownerId: customer.id, visitorName: customer.name, visitorEmail: customer.email, visitAt: dateAtOffset(1, 9), quantity: 2, amountVnd: 160000, status: TicketStatus.VALID },
  });

  const tourSeeds = [
    { title: "Dấu ấn Đông Sơn", startsAt: dateAtOffset(1, 9), durationMins: 60, capacity: 15, guideId: staff.id, route: ["Trống đồng Ngọc Lũ", "Không gian Đông Sơn"] },
    { title: "Nghệ thuật Champa", startsAt: dateAtOffset(1, 14), durationMins: 75, capacity: 12, guideId: staff.id, route: ["Điêu khắc Champa", "Tượng Phật Đồng Dương"] },
    { title: "Mộc bản triều Nguyễn", startsAt: dateAtOffset(2, 10), durationMins: 50, capacity: 10, guideId: staff.id, route: ["Mộc bản Ngự chế", "Di sản Ký ức"] },
  ];
  for (const tour of tourSeeds) await prisma.tour.upsert({ where: { title_startsAt: { title: tour.title, startsAt: tour.startsAt } }, update: { guideId: staff.id, capacity: tour.capacity, route: tour.route }, create: tour });

  // Clearly marked synthetic visits power dashboard examples until a real gate integration is connected.
  const demoVisits = [];
  for (let day = 1; day <= 30; day++) {
    for (let visitor = 1; visitor <= (day % 3 === 0 ? 24 : 18); visitor++) {
      const visitedAt = dateAtOffset(-day, 8 + ((visitor * 3) % 10));
      const id = `demo-visit-${day}-${visitor}`;
      demoVisits.push({ id, visitorName: `Khách mẫu ${visitor}`, source: "DEMO", visitedAt });
    }
  }
  await prisma.visitorVisit.createMany({ data: demoVisits, skipDuplicates: true });

  console.log("Seeded 3 accounts, 10 artifacts, 3 exhibitions, 3 future tours, and 600 synthetic analytics visits.");
}

main().finally(async () => prisma.$disconnect());
