-- CreateTable
CREATE TABLE "rides" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "lat" TEXT,
    "lng" TEXT,
    "sessionKey" TEXT NOT NULL,
    "isCallAccepted" BOOLEAN NOT NULL DEFAULT false,
    "customerSupportId" INTEGER,
    "isRideAcceptedBy" BOOLEAN NOT NULL DEFAULT false,
    "ambulancePartnerId" INTEGER
);

-- CreateTable
CREATE TABLE "customerSupport" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "ambulancePartner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "rides_id_key" ON "rides"("id");

-- CreateIndex
CREATE UNIQUE INDEX "customerSupport_id_key" ON "customerSupport"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ambulancePartner_id_key" ON "ambulancePartner"("id");

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_customerSupportId_fkey" FOREIGN KEY ("customerSupportId") REFERENCES "customerSupport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_ambulancePartnerId_fkey" FOREIGN KEY ("ambulancePartnerId") REFERENCES "ambulancePartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
