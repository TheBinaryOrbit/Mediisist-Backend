-- AlterTable
ALTER TABLE "ambulancePartner" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "vehicleNumber" TEXT;

-- AlterTable
ALTER TABLE "customerSupport" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "rides" ADD COLUMN     "address" TEXT;
