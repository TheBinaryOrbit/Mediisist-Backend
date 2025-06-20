/*
  Warnings:

  - You are about to drop the column `isRideAcceptedBy` on the `rides` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rides" DROP COLUMN "isRideAcceptedBy",
ADD COLUMN     "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isRideAccepted" BOOLEAN NOT NULL DEFAULT false;
