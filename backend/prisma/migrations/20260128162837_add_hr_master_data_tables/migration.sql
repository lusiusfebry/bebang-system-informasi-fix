-- CreateEnum
CREATE TYPE "StatusMaster" AS ENUM ('AKTIF', 'TIDAK_AKTIF');

-- CreateTable
CREATE TABLE "divisi" (
    "id" TEXT NOT NULL,
    "namaDivisi" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "StatusMaster" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "divisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" TEXT NOT NULL,
    "namaDepartment" TEXT NOT NULL,
    "managerId" TEXT,
    "divisiId" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "StatusMaster" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posisi_jabatan" (
    "id" TEXT NOT NULL,
    "namaPosisiJabatan" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "StatusMaster" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posisi_jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori_pangkat" (
    "id" TEXT NOT NULL,
    "namaKategoriPangkat" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "StatusMaster" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_pangkat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "golongan" (
    "id" TEXT NOT NULL,
    "namaGolongan" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "StatusMaster" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "golongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_golongan" (
    "id" TEXT NOT NULL,
    "namaSubGolongan" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "StatusMaster" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_golongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_hubungan_kerja" (
    "id" TEXT NOT NULL,
    "namaJenisHubunganKerja" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "StatusMaster" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jenis_hubungan_kerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "namaTag" TEXT NOT NULL,
    "warnaTag" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "StatusMaster" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lokasi_kerja" (
    "id" TEXT NOT NULL,
    "namaLokasiKerja" TEXT NOT NULL,
    "alamat" TEXT,
    "keterangan" TEXT,
    "status" "StatusMaster" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lokasi_kerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_karyawan" (
    "id" TEXT NOT NULL,
    "namaStatus" TEXT NOT NULL,
    "keterangan" TEXT,
    "status" "StatusMaster" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_karyawan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_divisiId_fkey" FOREIGN KEY ("divisiId") REFERENCES "divisi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posisi_jabatan" ADD CONSTRAINT "posisi_jabatan_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
