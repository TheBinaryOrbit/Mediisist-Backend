/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `customerSupport` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "customerSupport_phoneNumber_key" ON "customerSupport"("phoneNumber");
