/**
 * Employee Validation Schemas
 * Zod schemas untuk validasi input Employee management
 */

import { z } from 'zod';

// ==========================================
// COMMON PATTERNS
// ==========================================

const nikPattern = /^\d{16}$/; // 16 digit NIK
const npwpPattern = /^\d{15}$/; // 15 digit NPWP
const phonePattern = /^(\+62|62|0)[0-9]{9,12}$/;

// ==========================================
// ENUM SCHEMAS
// ==========================================

export const jenisKelaminEnum = z.enum(['LAKI_LAKI', 'PEREMPUAN']);
export const agamaEnum = z.enum(['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU']);
export const golonganDarahEnum = z.enum(['A', 'B', 'AB', 'O']);
export const statusPernikahanEnum = z.enum(['BELUM_MENIKAH', 'MENIKAH', 'CERAI_HIDUP', 'CERAI_MATI']);
export const statusKelulusanEnum = z.enum(['LULUS', 'TIDAK_LULUS', 'SEDANG_BELAJAR']);
export const tingkatPendidikanEnum = z.enum(['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3']);

// ==========================================
// KARYAWAN SCHEMA
// ==========================================

export const createKaryawanSchema = z.object({
    // Head Section - Required
    namaLengkap: z.string().min(1, 'Nama lengkap wajib diisi').max(200),
    nomorIndukKaryawan: z.string().min(1, 'NIK wajib diisi').max(50),
    nomorHandphone: z.string().regex(phonePattern, 'Format nomor handphone tidak valid'),

    // Head Section - Optional
    fotoKaryawan: z.string().max(500).optional(),
    divisiId: z.string().uuid('Format divisi ID tidak valid').optional().nullable(),
    departmentId: z.string().uuid('Format department ID tidak valid').optional().nullable(),
    managerId: z.string().uuid('Format manager ID tidak valid').optional().nullable(),
    atasanLangsungId: z.string().uuid('Format atasan langsung ID tidak valid').optional().nullable(),
    posisiJabatanId: z.string().uuid('Format posisi jabatan ID tidak valid').optional().nullable(),
    emailPerusahaan: z.string().email('Format email tidak valid').optional().nullable(),
    statusKaryawanId: z.string().uuid('Format status karyawan ID tidak valid').optional().nullable(),
    lokasiKerjaId: z.string().uuid('Format lokasi kerja ID tidak valid').optional().nullable(),
    tagId: z.string().uuid('Format tag ID tidak valid').optional().nullable(),

    // Personal Information
    jenisKelamin: jenisKelaminEnum.optional().nullable(),
    tempatLahir: z.string().max(100).optional().nullable(),
    tanggalLahir: z.coerce.date().optional().nullable(),
    emailPribadi: z.string().email('Format email pribadi tidak valid').optional().nullable(),
    agama: agamaEnum.optional().nullable(),
    golonganDarah: golonganDarahEnum.optional().nullable(),
    nomorKartuKeluarga: z.string().max(16).optional().nullable(),
    nomorKtp: z.string().regex(nikPattern, 'NIK harus 16 digit').optional().nullable().or(z.literal('')),
    nomorNpwp: z.string().regex(npwpPattern, 'NPWP harus 15 digit').optional().nullable().or(z.literal('')),
    nomorBpjs: z.string().max(20).optional().nullable(),
    noNikKk: z.string().max(20).optional().nullable(),
    statusPajak: z.string().max(50).optional().nullable(),
    alamatDomisili: z.string().max(500).optional().nullable(),
    kotaDomisili: z.string().max(100).optional().nullable(),
    provinsiDomisili: z.string().max(100).optional().nullable(),
    alamatKtp: z.string().max(500).optional().nullable(),
    kotaKtp: z.string().max(100).optional().nullable(),
    provinsiKtp: z.string().max(100).optional().nullable(),
    nomorHandphone2: z.string().regex(phonePattern, 'Format nomor handphone 2 tidak valid').optional().nullable().or(z.literal('')),
    nomorTeleponRumah1: z.string().regex(phonePattern, 'Format nomor telepon rumah 1 tidak valid').optional().nullable().or(z.literal('')),
    nomorTeleponRumah2: z.string().regex(phonePattern, 'Format nomor telepon rumah 2 tidak valid').optional().nullable().or(z.literal('')),
    statusPernikahan: statusPernikahanEnum.optional().nullable(),
    namaPasangan: z.string().max(200).optional().nullable(),
    tanggalMenikah: z.coerce.date().optional().nullable(),
    tanggalCerai: z.coerce.date().optional().nullable(),
    tanggalWafatPasangan: z.coerce.date().optional().nullable(),
    pekerjaanPasangan: z.string().max(100).optional().nullable(),
    jumlahAnak: z.number().int().min(0).max(20).optional().nullable(),
    nomorRekening: z.string().max(50).optional().nullable(),
    namaPemegangRekening: z.string().max(200).optional().nullable(),
    namaBank: z.string().max(100).optional().nullable(),
    cabangBank: z.string().max(100).optional().nullable(),

    // HR Information
    jenisHubunganKerjaId: z.string().uuid().optional().nullable(),
    tanggalMasukGroup: z.coerce.date().optional().nullable(),
    tanggalMasuk: z.coerce.date().optional().nullable(),
    tanggalPermanent: z.coerce.date().optional().nullable(),
    tanggalKontrak: z.coerce.date().optional().nullable(),
    tanggalAkhirKontrak: z.coerce.date().optional().nullable(),
    tanggalBerhenti: z.coerce.date().optional().nullable(),
    tingkatPendidikan: tingkatPendidikanEnum.optional().nullable(),
    bidangStudi: z.string().max(100).optional().nullable(),
    namaSekolah: z.string().max(200).optional().nullable(),
    kotaSekolah: z.string().max(100).optional().nullable(),
    statusKelulusan: statusKelulusanEnum.optional().nullable(),
    keteranganPendidikan: z.string().max(500).optional().nullable(),
    kategoriPangkatId: z.string().uuid().optional().nullable(),
    golonganPangkatId: z.string().uuid().optional().nullable(),
    subGolonganPangkatId: z.string().uuid().optional().nullable(),
    noDanaPensiun: z.string().max(50).optional().nullable(),
    namaKontakDarurat1: z.string().max(200).optional().nullable(),
    nomorTeleponKontakDarurat1: z.string().regex(phonePattern, 'Format nomor telepon kontak darurat 1 tidak valid').optional().nullable().or(z.literal('')),
    hubunganKontakDarurat1: z.string().max(50).optional().nullable(),
    alamatKontakDarurat1: z.string().max(500).optional().nullable(),
    namaKontakDarurat2: z.string().max(200).optional().nullable(),
    nomorTeleponKontakDarurat2: z.string().regex(phonePattern, 'Format nomor telepon kontak darurat 2 tidak valid').optional().nullable().or(z.literal('')),
    hubunganKontakDarurat2: z.string().max(50).optional().nullable(),
    alamatKontakDarurat2: z.string().max(500).optional().nullable(),
    pointOfOriginal: z.string().max(100).optional().nullable(),
    pointOfHire: z.string().max(100).optional().nullable(),
    ukuranSeragamKerja: z.string().max(10).optional().nullable(),
    ukuranSepatuKerja: z.string().max(10).optional().nullable(),
    lokasiSebelumnyaId: z.string().uuid().optional().nullable(),
    tanggalMutasi: z.coerce.date().optional().nullable(),
    siklusPembayaranGaji: z.string().max(50).optional().nullable(),
    costing: z.string().max(100).optional().nullable(),
    assign: z.string().max(100).optional().nullable(),
    actual: z.string().max(100).optional().nullable(),

    // Family Information
    tanggalLahirPasangan: z.coerce.date().optional().nullable(),
    pendidikanTerakhirPasangan: z.string().max(100).optional().nullable(),
    keteranganPasangan: z.string().max(500).optional().nullable(),
    anakKe: z.number().int().min(1).max(20).optional().nullable(),
    jumlahSaudaraKandung: z.number().int().min(0).max(5).optional().nullable(),
    namaAyahMertua: z.string().max(200).optional().nullable(),
    tanggalLahirAyahMertua: z.coerce.date().optional().nullable(),
    pendidikanTerakhirAyahMertua: z.string().max(100).optional().nullable(),
    keteranganAyahMertua: z.string().max(500).optional().nullable(),
    namaIbuMertua: z.string().max(200).optional().nullable(),
    tanggalLahirIbuMertua: z.coerce.date().optional().nullable(),
    pendidikanTerakhirIbuMertua: z.string().max(100).optional().nullable(),
    keteranganIbuMertua: z.string().max(500).optional().nullable(),
});

export const updateKaryawanSchema = createKaryawanSchema.partial();

// ==========================================
// ANAK SCHEMA
// ==========================================

export const createAnakSchema = z.object({
    urutanAnak: z.number().int().min(1, 'Urutan anak minimal 1'),
    namaAnak: z.string().min(1, 'Nama anak wajib diisi').max(200),
    jenisKelamin: jenisKelaminEnum,
    tanggalLahir: z.coerce.date(),
    keterangan: z.string().max(500).optional().nullable(),
});

export const updateAnakSchema = createAnakSchema.partial();

// ==========================================
// SAUDARA KANDUNG SCHEMA
// ==========================================

export const createSaudaraKandungSchema = z.object({
    urutanSaudara: z.number().int().min(1).max(5, 'Maksimal 5 saudara kandung'),
    namaSaudaraKandung: z.string().min(1, 'Nama saudara kandung wajib diisi').max(200),
    jenisKelamin: jenisKelaminEnum,
    tanggalLahir: z.coerce.date().optional().nullable(),
    pendidikanTerakhir: z.string().max(100).optional().nullable(),
    pekerjaan: z.string().max(100).optional().nullable(),
    keterangan: z.string().max(500).optional().nullable(),
});

export const updateSaudaraKandungSchema = createSaudaraKandungSchema.partial();

// ==========================================
// DOKUMEN KARYAWAN SCHEMA
// ==========================================

export const createDokumenKaryawanSchema = z.object({
    jenisDokumen: z.string().min(1, 'Jenis dokumen wajib diisi').max(50),
    namaFile: z.string().min(1, 'Nama file wajib diisi').max(255),
    pathFile: z.string().min(1, 'Path file wajib diisi').max(500),
    ukuranFile: z.number().int().positive('Ukuran file harus positif'),
    mimeType: z.string().min(1, 'MIME type wajib diisi').max(100),
    keterangan: z.string().max(500).optional().nullable(),
});

// ==========================================
// QUERY PARAMETER SCHEMA
// ==========================================

export const karyawanQuerySchema = z.object({
    search: z.string().max(100).optional(),
    divisiId: z.string().uuid().optional(),
    departmentId: z.string().uuid().optional(),
    statusKaryawanId: z.string().uuid().optional(),
    lokasiKerjaId: z.string().uuid().optional(),
    tagId: z.string().uuid().optional(),
    jenisHubunganKerjaId: z.string().uuid().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.enum(['namaLengkap', 'nomorIndukKaryawan', 'createdAt', 'tanggalMasuk']).default('namaLengkap'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// ==========================================
// TYPE EXPORTS (Inferred from schemas)
// ==========================================

export type CreateKaryawanInput = z.infer<typeof createKaryawanSchema>;
export type UpdateKaryawanInput = z.infer<typeof updateKaryawanSchema>;
export type CreateAnakInput = z.infer<typeof createAnakSchema>;
export type UpdateAnakInput = z.infer<typeof updateAnakSchema>;
export type CreateSaudaraKandungInput = z.infer<typeof createSaudaraKandungSchema>;
export type UpdateSaudaraKandungInput = z.infer<typeof updateSaudaraKandungSchema>;
export type CreateDokumenKaryawanInput = z.infer<typeof createDokumenKaryawanSchema>;
export type KaryawanQueryInput = z.infer<typeof karyawanQuerySchema>;
