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
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "clinicName" TEXT,
    "clinicAddress" TEXT,
    "lat" TEXT,
    "lng" TEXT
);

-- CreateTable
CREATE TABLE "education" (
    "id" SERIAL NOT NULL,
    "courseName" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "yearofPassing" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "experience" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "hospital" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "currentlyWorking" BOOLEAN NOT NULL DEFAULT false,
    "doctorId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "timings" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "doctorId" INTEGER NOT NULL
);

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

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience" ADD CONSTRAINT "experience_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timings" ADD CONSTRAINT "timings_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
