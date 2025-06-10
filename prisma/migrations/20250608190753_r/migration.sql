/*
  Warnings:

  - A unique constraint covering the columns `[sessionKey]` on the table `rides` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "rides" ADD COLUMN     "isLocationAvail" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "rides_sessionKey_key" ON "rides"("sessionKey");
