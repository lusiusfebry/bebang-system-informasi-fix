-- CreateEnum
CREATE TYPE "ResignationType" AS ENUM ('RESIGNATION', 'TERMINATION', 'LAYOFF', 'RETIREMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "ResignationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "resignations" (
    "id" TEXT NOT NULL,
    "karyawanId" TEXT NOT NULL,
    "type" "ResignationType" NOT NULL DEFAULT 'RESIGNATION',
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "remarks" TEXT,
    "status" "ResignationStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resignations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resignations_karyawanId_idx" ON "resignations"("karyawanId");

-- CreateIndex
CREATE INDEX "resignations_status_idx" ON "resignations"("status");

-- AddForeignKey
ALTER TABLE "resignations" ADD CONSTRAINT "resignations_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
