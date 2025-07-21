-- AlterTable
ALTER TABLE "doctor" ADD COLUMN     "isfeatured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "timings" ADD COLUMN     "fee" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "startTime" SET DEFAULT '10:00',
ALTER COLUMN "endTime" SET DEFAULT '17:00';

-- CreateTable
CREATE TABLE "slots" (
    "id" SERIAL NOT NULL,
    "startTime" TEXT NOT NULL DEFAULT '10:00',
    "endTime" TEXT NOT NULL DEFAULT '17:00',
    "timmingsId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "slots_id_key" ON "slots"("id");

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_timmingsId_fkey" FOREIGN KEY ("timmingsId") REFERENCES "timings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
