-- CreateEnum
CREATE TYPE "withdrawStatus" AS ENUM ('PENDING', 'SUCCESS', 'REJECTED');

-- AlterTable
ALTER TABLE "doctor" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "withdraw" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "withdrawStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethodId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "withdraw_id_key" ON "withdraw"("id");

-- AddForeignKey
ALTER TABLE "withdraw" ADD CONSTRAINT "withdraw_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraw" ADD CONSTRAINT "withdraw_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "paymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
