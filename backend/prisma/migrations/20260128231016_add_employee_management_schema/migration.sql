-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "Agama" AS ENUM ('ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU');

-- CreateEnum
CREATE TYPE "GolonganDarah" AS ENUM ('A', 'B', 'AB', 'O');

-- CreateEnum
CREATE TYPE "StatusPernikahan" AS ENUM ('BELUM_MENIKAH', 'MENIKAH', 'CERAI_HIDUP', 'CERAI_MATI');

-- CreateEnum
CREATE TYPE "StatusKelulusan" AS ENUM ('LULUS', 'TIDAK_LULUS', 'SEDANG_BELAJAR');

-- CreateEnum
CREATE TYPE "TingkatPendidikan" AS ENUM ('SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3');

-- DropForeignKey
ALTER TABLE "posisi_jabatan" DROP CONSTRAINT "posisi_jabatan_departmentId_fkey";

-- AlterTable
ALTER TABLE "posisi_jabatan" ALTER COLUMN "departmentId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "karyawan" (
    "id" TEXT NOT NULL,
    "fotoKaryawan" TEXT,
    "namaLengkap" TEXT NOT NULL,
    "nomorIndukKaryawan" TEXT NOT NULL,
    "divisiId" TEXT,
    "departmentId" TEXT,
    "managerId" TEXT,
    "atasanLangsungId" TEXT,
    "posisiJabatanId" TEXT,
    "emailPerusahaan" TEXT,
    "nomorHandphone" TEXT NOT NULL,
    "statusKaryawanId" TEXT,
    "lokasiKerjaId" TEXT,
    "tagId" TEXT,
    "jenisKelamin" "JenisKelamin",
    "tempatLahir" TEXT,
    "tanggalLahir" TIMESTAMP(3),
    "emailPribadi" TEXT,
    "agama" "Agama",
    "golonganDarah" "GolonganDarah",
    "nomorKartuKeluarga" TEXT,
    "nomorKtp" TEXT,
    "nomorNpwp" TEXT,
    "nomorBpjs" TEXT,
    "noNikKk" TEXT,
    "statusPajak" TEXT,
    "alamatDomisili" TEXT,
    "kotaDomisili" TEXT,
    "provinsiDomisili" TEXT,
    "alamatKtp" TEXT,
    "kotaKtp" TEXT,
    "provinsiKtp" TEXT,
    "nomorHandphone2" TEXT,
    "nomorTeleponRumah1" TEXT,
    "nomorTeleponRumah2" TEXT,
    "statusPernikahan" "StatusPernikahan",
    "namaPasangan" TEXT,
    "tanggalMenikah" TIMESTAMP(3),
    "tanggalCerai" TIMESTAMP(3),
    "tanggalWafatPasangan" TIMESTAMP(3),
    "pekerjaanPasangan" TEXT,
    "jumlahAnak" INTEGER DEFAULT 0,
    "nomorRekening" TEXT,
    "namaPemegangRekening" TEXT,
    "namaBank" TEXT,
    "cabangBank" TEXT,
    "jenisHubunganKerjaId" TEXT,
    "tanggalMasukGroup" TIMESTAMP(3),
    "tanggalMasuk" TIMESTAMP(3),
    "tanggalPermanent" TIMESTAMP(3),
    "tanggalKontrak" TIMESTAMP(3),
    "tanggalAkhirKontrak" TIMESTAMP(3),
    "tanggalBerhenti" TIMESTAMP(3),
    "tingkatPendidikan" "TingkatPendidikan",
    "bidangStudi" TEXT,
    "namaSekolah" TEXT,
    "kotaSekolah" TEXT,
    "statusKelulusan" "StatusKelulusan",
    "keteranganPendidikan" TEXT,
    "kategoriPangkatId" TEXT,
    "golonganPangkatId" TEXT,
    "subGolonganPangkatId" TEXT,
    "noDanaPensiun" TEXT,
    "namaKontakDarurat1" TEXT,
    "nomorTeleponKontakDarurat1" TEXT,
    "hubunganKontakDarurat1" TEXT,
    "alamatKontakDarurat1" TEXT,
    "namaKontakDarurat2" TEXT,
    "nomorTeleponKontakDarurat2" TEXT,
    "hubunganKontakDarurat2" TEXT,
    "alamatKontakDarurat2" TEXT,
    "pointOfOriginal" TEXT,
    "pointOfHire" TEXT,
    "ukuranSeragamKerja" TEXT,
    "ukuranSepatuKerja" TEXT,
    "lokasiSebelumnyaId" TEXT,
    "tanggalMutasi" TIMESTAMP(3),
    "siklusPembayaranGaji" TEXT,
    "costing" TEXT,
    "assign" TEXT,
    "actual" TEXT,
    "tanggalLahirPasangan" TIMESTAMP(3),
    "pendidikanTerakhirPasangan" TEXT,
    "keteranganPasangan" TEXT,
    "anakKe" INTEGER,
    "jumlahSaudaraKandung" INTEGER DEFAULT 0,
    "namaAyahMertua" TEXT,
    "tanggalLahirAyahMertua" TIMESTAMP(3),
    "pendidikanTerakhirAyahMertua" TEXT,
    "keteranganAyahMertua" TEXT,
    "namaIbuMertua" TEXT,
    "tanggalLahirIbuMertua" TIMESTAMP(3),
    "pendidikanTerakhirIbuMertua" TEXT,
    "keteranganIbuMertua" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anak" (
    "id" TEXT NOT NULL,
    "karyawanId" TEXT NOT NULL,
    "urutanAnak" INTEGER NOT NULL,
    "namaAnak" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saudara_kandung" (
    "id" TEXT NOT NULL,
    "karyawanId" TEXT NOT NULL,
    "urutanSaudara" INTEGER NOT NULL,
    "namaSaudaraKandung" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "tanggalLahir" TIMESTAMP(3),
    "pendidikanTerakhir" TEXT,
    "pekerjaan" TEXT,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saudara_kandung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dokumen_karyawan" (
    "id" TEXT NOT NULL,
    "karyawanId" TEXT NOT NULL,
    "jenisDokumen" TEXT NOT NULL,
    "namaFile" TEXT NOT NULL,
    "pathFile" TEXT NOT NULL,
    "ukuranFile" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dokumen_karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_nomorIndukKaryawan_key" ON "karyawan"("nomorIndukKaryawan");

-- CreateIndex
CREATE UNIQUE INDEX "anak_karyawanId_urutanAnak_key" ON "anak"("karyawanId", "urutanAnak");

-- CreateIndex
CREATE UNIQUE INDEX "saudara_kandung_karyawanId_urutanSaudara_key" ON "saudara_kandung"("karyawanId", "urutanSaudara");

-- AddForeignKey
ALTER TABLE "posisi_jabatan" ADD CONSTRAINT "posisi_jabatan_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_divisiId_fkey" FOREIGN KEY ("divisiId") REFERENCES "divisi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "karyawan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_atasanLangsungId_fkey" FOREIGN KEY ("atasanLangsungId") REFERENCES "karyawan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_posisiJabatanId_fkey" FOREIGN KEY ("posisiJabatanId") REFERENCES "posisi_jabatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_statusKaryawanId_fkey" FOREIGN KEY ("statusKaryawanId") REFERENCES "status_karyawan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_lokasiKerjaId_fkey" FOREIGN KEY ("lokasiKerjaId") REFERENCES "lokasi_kerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_jenisHubunganKerjaId_fkey" FOREIGN KEY ("jenisHubunganKerjaId") REFERENCES "jenis_hubungan_kerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_kategoriPangkatId_fkey" FOREIGN KEY ("kategoriPangkatId") REFERENCES "kategori_pangkat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_golonganPangkatId_fkey" FOREIGN KEY ("golonganPangkatId") REFERENCES "golongan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_subGolonganPangkatId_fkey" FOREIGN KEY ("subGolonganPangkatId") REFERENCES "sub_golongan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_lokasiSebelumnyaId_fkey" FOREIGN KEY ("lokasiSebelumnyaId") REFERENCES "lokasi_kerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anak" ADD CONSTRAINT "anak_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saudara_kandung" ADD CONSTRAINT "saudara_kandung_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dokumen_karyawan" ADD CONSTRAINT "dokumen_karyawan_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
