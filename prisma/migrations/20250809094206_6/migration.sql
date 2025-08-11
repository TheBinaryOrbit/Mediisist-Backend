/*
  Warnings:

  - You are about to drop the column `Mode` on the `appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rpzRefundPaymentId]` on the table `appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mode` to the `appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointment" DROP COLUMN "Mode",
ADD COLUMN     "isRescheduled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mode" "AppointmentMode" NOT NULL,
ADD COLUMN     "rpzRefundPaymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "appointment_rpzRefundPaymentId_key" ON "appointment"("rpzRefundPaymentId");
