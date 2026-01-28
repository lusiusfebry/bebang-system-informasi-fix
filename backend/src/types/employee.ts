/**
 * Employee Types & DTOs
 * TypeScript interfaces untuk Employee management entities
 */

// Re-export Prisma types
export type {
    Karyawan,
    Anak,
    SaudaraKandung,
    DokumenKaryawan,
    JenisKelamin,
    Agama,
    GolonganDarah,
    StatusPernikahan,
    StatusKelulusan,
    TingkatPendidikan,
} from '@prisma/client';

import type {
    Karyawan,
    Anak,
    SaudaraKandung,
    DokumenKaryawan,
    JenisKelamin,
    Agama,
    GolonganDarah,
    StatusPernikahan,
    StatusKelulusan,
    TingkatPendidikan,
    Divisi,
    Department,
    PosisiJabatan,
    StatusKaryawan,
    LokasiKerja,
    Tag,
    JenisHubunganKerja,
    KategoriPangkat,
    Golongan,
    SubGolongan,
} from '@prisma/client';

// ==========================================
// CREATE DTOs
// ==========================================

export interface CreateKaryawanDTO {
    // Head Section - Required
    namaLengkap: string;
    nomorIndukKaryawan: string;
    nomorHandphone: string;

    // Head Section - Optional
    fotoKaryawan?: string;
    divisiId?: string;
    departmentId?: string;
    managerId?: string;
    atasanLangsungId?: string;
    posisiJabatanId?: string;
    emailPerusahaan?: string;
    statusKaryawanId?: string;
    lokasiKerjaId?: string;
    tagId?: string;

    // Personal Information
    jenisKelamin?: JenisKelamin;
    tempatLahir?: string;
    tanggalLahir?: Date | string;
    emailPribadi?: string;
    agama?: Agama;
    golonganDarah?: GolonganDarah;
    nomorKartuKeluarga?: string;
    nomorKtp?: string;
    nomorNpwp?: string;
    nomorBpjs?: string;
    noNikKk?: string;
    statusPajak?: string;
    alamatDomisili?: string;
    kotaDomisili?: string;
    provinsiDomisili?: string;
    alamatKtp?: string;
    kotaKtp?: string;
    provinsiKtp?: string;
    nomorHandphone2?: string;
    nomorTeleponRumah1?: string;
    nomorTeleponRumah2?: string;
    statusPernikahan?: StatusPernikahan;
    namaPasangan?: string;
    tanggalMenikah?: Date | string;
    tanggalCerai?: Date | string;
    tanggalWafatPasangan?: Date | string;
    pekerjaanPasangan?: string;
    jumlahAnak?: number;
    nomorRekening?: string;
    namaPemegangRekening?: string;
    namaBank?: string;
    cabangBank?: string;

    // HR Information
    jenisHubunganKerjaId?: string;
    tanggalMasukGroup?: Date | string;
    tanggalMasuk?: Date | string;
    tanggalPermanent?: Date | string;
    tanggalKontrak?: Date | string;
    tanggalAkhirKontrak?: Date | string;
    tanggalBerhenti?: Date | string;
    tingkatPendidikan?: TingkatPendidikan;
    bidangStudi?: string;
    namaSekolah?: string;
    kotaSekolah?: string;
    statusKelulusan?: StatusKelulusan;
    keteranganPendidikan?: string;
    kategoriPangkatId?: string;
    golonganPangkatId?: string;
    subGolonganPangkatId?: string;
    noDanaPensiun?: string;
    namaKontakDarurat1?: string;
    nomorTeleponKontakDarurat1?: string;
    hubunganKontakDarurat1?: string;
    alamatKontakDarurat1?: string;
    namaKontakDarurat2?: string;
    nomorTeleponKontakDarurat2?: string;
    hubunganKontakDarurat2?: string;
    alamatKontakDarurat2?: string;
    pointOfOriginal?: string;
    pointOfHire?: string;
    ukuranSeragamKerja?: string;
    ukuranSepatuKerja?: string;
    lokasiSebelumnyaId?: string;
    tanggalMutasi?: Date | string;
    siklusPembayaranGaji?: string;
    costing?: string;
    assign?: string;
    actual?: string;

    // Family Information
    tanggalLahirPasangan?: Date | string;
    pendidikanTerakhirPasangan?: string;
    keteranganPasangan?: string;
    anakKe?: number;
    jumlahSaudaraKandung?: number;
    namaAyahMertua?: string;
    tanggalLahirAyahMertua?: Date | string;
    pendidikanTerakhirAyahMertua?: string;
    keteranganAyahMertua?: string;
    namaIbuMertua?: string;
    tanggalLahirIbuMertua?: Date | string;
    pendidikanTerakhirIbuMertua?: string;
    keteranganIbuMertua?: string;
}

export type UpdateKaryawanDTO = Partial<CreateKaryawanDTO>;

export interface CreateAnakDTO {
    urutanAnak: number;
    namaAnak: string;
    jenisKelamin: JenisKelamin;
    tanggalLahir: Date | string;
    keterangan?: string;
}

export type UpdateAnakDTO = Partial<CreateAnakDTO>;

export interface CreateSaudaraKandungDTO {
    urutanSaudara: number;
    namaSaudaraKandung: string;
    jenisKelamin: JenisKelamin;
    tanggalLahir?: Date | string;
    pendidikanTerakhir?: string;
    pekerjaan?: string;
    keterangan?: string;
}

export type UpdateSaudaraKandungDTO = Partial<CreateSaudaraKandungDTO>;

export interface CreateDokumenKaryawanDTO {
    jenisDokumen: string;
    namaFile: string;
    pathFile: string;
    ukuranFile: number;
    mimeType: string;
    keterangan?: string;
}

// ==========================================
// RESPONSE DTOs
// ==========================================

export interface KaryawanDetailResponse extends Karyawan {
    divisi?: Divisi | null;
    department?: Department | null;
    posisiJabatan?: PosisiJabatan | null;
    statusKaryawan?: StatusKaryawan | null;
    lokasiKerja?: LokasiKerja | null;
    tag?: Tag | null;
    jenisHubunganKerja?: JenisHubunganKerja | null;
    kategoriPangkat?: KategoriPangkat | null;
    golonganPangkat?: Golongan | null;
    subGolonganPangkat?: SubGolongan | null;
    lokasiSebelumnya?: LokasiKerja | null;
    manager?: Karyawan | null;
    atasanLangsung?: Karyawan | null;
    anak?: Anak[];
    saudaraKandung?: SaudaraKandung[];
    dokumen?: DokumenKaryawan[];
}

export interface KaryawanListResponse {
    id: string;
    nomorIndukKaryawan: string;
    namaLengkap: string;
    fotoKaryawan?: string | null;
    emailPerusahaan?: string | null;
    nomorHandphone: string;
    divisi?: { id: string; namaDivisi: string } | null;
    department?: { id: string; namaDepartment: string } | null;
    posisiJabatan?: { id: string; namaPosisiJabatan: string } | null;
    statusKaryawan?: { id: string; namaStatus: string } | null;
    lokasiKerja?: { id: string; namaLokasiKerja: string } | null;
    tag?: { id: string; namaTag: string; warnaTag: string } | null;
    tanggalMasuk?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// ==========================================
// QUERY PARAMS
// ==========================================

export interface KaryawanQueryParams {
    search?: string;
    divisiId?: string;
    departmentId?: string;
    statusKaryawanId?: string;
    lokasiKerjaId?: string;
    tagId?: string;
    jenisHubunganKerjaId?: string;
    page?: number;
    limit?: number;
    sortBy?: 'namaLengkap' | 'nomorIndukKaryawan' | 'createdAt' | 'tanggalMasuk';
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedKaryawanResponse {
    data: KaryawanListResponse[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
