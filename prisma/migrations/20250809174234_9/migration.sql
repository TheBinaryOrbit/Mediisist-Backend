/*
  Warnings:

  - A unique constraint covering the columns `[rpzPaymentId]` on the table `appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "appointment" ADD COLUMN     "rpzPaymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "appointment_rpzPaymentId_key" ON "appointment"("rpzPaymentId");
