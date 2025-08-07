-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "AppointmentMode" AS ENUM ('ONLINE', 'IN_CLINIC');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SCHEDULED', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "rides" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "sessionKey" TEXT NOT NULL,
    "isLocationAvail" BOOLEAN NOT NULL DEFAULT false,
    "lat" TEXT,
    "lng" TEXT,
    "isCallAccepted" BOOLEAN NOT NULL DEFAULT false,
    "isCallCompleted" BOOLEAN NOT NULL DEFAULT false,
    "customerSupportId" INTEGER,
    "isRideAccepted" BOOLEAN NOT NULL DEFAULT false,
    "isRideCompleted" BOOLEAN NOT NULL DEFAULT false,
    "ambulancePartnerId" INTEGER,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "customerSupport" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "fcmToken" TEXT,
    "imageUrl" TEXT
);

-- CreateTable
CREATE TABLE "ambulancePartner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "lat" TEXT,
    "lng" TEXT,
    "imageUrl" TEXT,
    "vehicleNumber" TEXT,
    "fcmToken" TEXT
);

-- CreateTable
CREATE TABLE "doctor" (
    "id" SERIAL NOT NULL,
    "fName" TEXT NOT NULL,
    "lName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "imageUrl" TEXT,
    "specialization" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isfeatured" BOOLEAN NOT NULL DEFAULT false,
    "clinicName" TEXT,
    "clinicAddress" TEXT,
    "lat" TEXT,
    "lng" TEXT
);

-- CreateTable
CREATE TABLE "education" (
    "id" SERIAL NOT NULL,
    "courseName" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "yearOfPassing" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "experience" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "hospital" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT,
    "currentlyWorking" BOOLEAN NOT NULL DEFAULT false,
    "doctorId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "timings" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT DEFAULT '10:00',
    "endTime" TEXT DEFAULT '17:00',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "fee" INTEGER DEFAULT 0,
    "doctorId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "slots" (
    "id" SERIAL NOT NULL,
    "startTime" TEXT NOT NULL DEFAULT '10:00',
    "endTime" TEXT NOT NULL DEFAULT '17:00',
    "timingsId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "paymentMethod" (
    "id" SERIAL NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "bankeeName" TEXT NOT NULL,
    "doctorId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL
);

-- CreateTable
CREATE TABLE "appointment" (
    "id" SERIAL NOT NULL,
    "patientFirstName" TEXT NOT NULL,
    "patientLastName" TEXT NOT NULL,
    "patientAge" INTEGER NOT NULL,
    "patientGender" "Gender" NOT NULL,
    "patientPhoneNumber" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "Mode" "AppointmentMode" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'SCHEDULED',
    "rpzOrderId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slotId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prescriptionUrl" TEXT
);

-- CreateTable
CREATE TABLE "patient" (
    "id" SERIAL NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "userid" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "rides_id_key" ON "rides"("id");

-- CreateIndex
CREATE UNIQUE INDEX "rides_sessionKey_key" ON "rides"("sessionKey");

-- CreateIndex
CREATE UNIQUE INDEX "customerSupport_id_key" ON "customerSupport"("id");

-- CreateIndex
CREATE UNIQUE INDEX "customerSupport_phoneNumber_key" ON "customerSupport"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ambulancePartner_id_key" ON "ambulancePartner"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ambulancePartner_phoneNumber_key" ON "ambulancePartner"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_id_key" ON "doctor"("id");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_phoneNumber_key" ON "doctor"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "education_id_key" ON "education"("id");

-- CreateIndex
CREATE UNIQUE INDEX "experience_id_key" ON "experience"("id");

-- CreateIndex
CREATE UNIQUE INDEX "timings_id_key" ON "timings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "slots_id_key" ON "slots"("id");

-- CreateIndex
CREATE UNIQUE INDEX "paymentMethod_id_key" ON "paymentMethod"("id");

-- CreateIndex
CREATE UNIQUE INDEX "paymentMethod_doctorId_key" ON "paymentMethod"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "user"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "appointment_id_key" ON "appointment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "appointment_patientPhoneNumber_key" ON "appointment"("patientPhoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "appointment_rpzOrderId_key" ON "appointment"("rpzOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "patient_id_key" ON "patient"("id");

-- CreateIndex
CREATE UNIQUE INDEX "patient_phoneNumber_key" ON "patient"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "patient_email_key" ON "patient"("email");

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_customerSupportId_fkey" FOREIGN KEY ("customerSupportId") REFERENCES "customerSupport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_ambulancePartnerId_fkey" FOREIGN KEY ("ambulancePartnerId") REFERENCES "ambulancePartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience" ADD CONSTRAINT "experience_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timings" ADD CONSTRAINT "timings_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_timingsId_fkey" FOREIGN KEY ("timingsId") REFERENCES "timings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paymentMethod" ADD CONSTRAINT "paymentMethod_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
