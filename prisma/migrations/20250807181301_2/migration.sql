/*
  Warnings:

  - You are about to drop the column `userid` on the `patient` table. All the data in the column will be lost.
  - Added the required column `userId` to the `patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "patient" DROP CONSTRAINT "patient_userid_fkey";

-- AlterTable
ALTER TABLE "patient" DROP COLUMN "userid",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
