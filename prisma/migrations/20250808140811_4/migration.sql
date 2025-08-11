/*
  Warnings:

  - You are about to drop the column `specialization` on the `doctor` table. All the data in the column will be lost.
  - Added the required column `specializationId` to the `doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "specialization",
ADD COLUMN     "specializationId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "specialization" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "symptom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "specializationId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "specialization_id_key" ON "specialization"("id");

-- CreateIndex
CREATE UNIQUE INDEX "symptom_id_key" ON "symptom"("id");

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symptom" ADD CONSTRAINT "symptom_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
