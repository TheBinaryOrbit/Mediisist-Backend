/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `ambulancePartner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ambulancePartner_phoneNumber_key" ON "ambulancePartner"("phoneNumber");
