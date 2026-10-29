-- CreateTable
CREATE TABLE "Exhibition" (
  "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "name" TEXT NOT NULL,
  "description" TEXT NOT NULL, "location" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL, "endsAt" TIMESTAMP(3) NOT NULL,
  "imageUrl" TEXT, "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Exhibition_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Exhibition_slug_key" ON "Exhibition"("slug");
CREATE INDEX "Exhibition_active_startsAt_endsAt_idx" ON "Exhibition"("active", "startsAt", "endsAt");

CREATE TABLE "TourBooking" (
  "id" TEXT NOT NULL, "tourId" TEXT NOT NULL, "userId" TEXT,
  "name" TEXT NOT NULL, "email" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TourBooking_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "TourBooking_tourId_createdAt_idx" ON "TourBooking"("tourId", "createdAt");
CREATE INDEX "TourBooking_email_idx" ON "TourBooking"("email");
ALTER TABLE "TourBooking" ADD CONSTRAINT "TourBooking_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TourBooking" ADD CONSTRAINT "TourBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "VisitorVisit" (
  "id" TEXT NOT NULL, "visitorName" TEXT, "ticketCode" TEXT,
  "source" TEXT NOT NULL DEFAULT 'WALK_IN',
  "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "recordedById" TEXT,
  CONSTRAINT "VisitorVisit_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "VisitorVisit_ticketCode_key" ON "VisitorVisit"("ticketCode");
CREATE INDEX "VisitorVisit_visitedAt_idx" ON "VisitorVisit"("visitedAt");
ALTER TABLE "VisitorVisit" ADD CONSTRAINT "VisitorVisit_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "MuseumSettings" (
  "id" TEXT NOT NULL DEFAULT 'museum', "name" TEXT NOT NULL,
  "address" TEXT NOT NULL, "city" TEXT NOT NULL, "founded" INTEGER NOT NULL,
  "openingTime" TEXT NOT NULL DEFAULT '08:00', "closingTime" TEXT NOT NULL DEFAULT '17:00',
  "ticketPriceVnd" INTEGER NOT NULL DEFAULT 80000,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MuseumSettings_pkey" PRIMARY KEY ("id")
);
