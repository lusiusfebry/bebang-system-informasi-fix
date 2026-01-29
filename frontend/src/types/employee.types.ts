/**
 * Employee Types & Interfaces
 * TypeScript types for employee data management
 */

// ==========================================
// ENUMS (matching backend Prisma schema)
// ==========================================

export enum JenisKelamin {
    LAKI_LAKI = 'LAKI_LAKI',
    PEREMPUAN = 'PEREMPUAN',
}

export enum Agama {
    ISLAM = 'ISLAM',
    KRISTEN = 'KRISTEN',
    KATOLIK = 'KATOLIK',
    HINDU = 'HINDU',
    BUDDHA = 'BUDDHA',
    KONGHUCU = 'KONGHUCU',
}

export enum GolonganDarah {
    A = 'A',
    B = 'B',
    AB = 'AB',
    O = 'O',
}

export enum StatusPernikahan {
    BELUM_MENIKAH = 'BELUM_MENIKAH',
    MENIKAH = 'MENIKAH',
    CERAI_HIDUP = 'CERAI_HIDUP',
    CERAI_MATI = 'CERAI_MATI',
}

export enum StatusMaster {
    AKTIF = 'AKTIF',
    TIDAK_AKTIF = 'TIDAK_AKTIF',
}

export enum TingkatPendidikan {
    SD = 'SD',
    SMP = 'SMP',
    SMA = 'SMA',
    D1 = 'D1',
    D2 = 'D2',
    D3 = 'D3',
    D4 = 'D4',
    S1 = 'S1',
    S2 = 'S2',
    S3 = 'S3',
}

export enum StatusKelulusan {
    LULUS = 'LULUS',
    TIDAK_LULUS = 'TIDAK_LULUS',
    MENUNGGU = 'MENUNGGU',
}

// ==========================================
// RELATED ENTITY INTERFACES
// ==========================================

export interface Divisi {
    id: string;
    namaDivisi: string;
}

export interface Department {
    id: string;
    namaDepartment: string;
}

export interface PosisiJabatan {
    id: string;
    namaPosisiJabatan: string;
}

export interface StatusKaryawan {
    id: string;
    namaStatusKaryawan: string;
}

export interface LokasiKerja {
    id: string;
    namaLokasiKerja: string;
}

export interface Tag {
    id: string;
    namaTag: string;
    warnaTag?: string;
}

export interface JenisHubunganKerja {
    id: string;
    namaJenisHubunganKerja: string;
}

// ==========================================
// CHILD DATA INTERFACES
// ==========================================

export interface Anak {
    id: string;
    karyawanId: string;
    urutanAnak: number;
    namaAnak: string;
    jenisKelamin: JenisKelamin;
    tanggalLahir?: string | null;
    keterangan?: string | null;
}

export interface SaudaraKandung {
    id: string;
    karyawanId: string;
    urutanSaudara: number;
    namaSaudaraKandung: string;
    jenisKelamin: JenisKelamin;
    tanggalLahir?: string | null;
    pekerjaan?: string | null;
}

export interface DokumenKaryawan {
    id: string;
    karyawanId: string;
    jenisDokumen: string;
    namaFile: string;
    pathFile: string;
    ukuranFile: number;
    mimeType: string;
    keterangan?: string | null;
    createdAt: string;
}

// ==========================================
// MAIN EMPLOYEE INTERFACES
// ==========================================

export interface Employee {
    id: string;
    namaLengkap: string;
    nomorIndukKaryawan: string;
    nomorHandphone: string;
    fotoKaryawan?: string | null;
    jenisKelamin?: JenisKelamin | null;
    tempatLahir?: string | null;
    tanggalLahir?: string | null;
    agama?: Agama | null;
    golonganDarah?: GolonganDarah | null;
    statusPernikahan?: StatusPernikahan | null;
    alamatKTP?: string | null;
    alamatDomisili?: string | null;
    nomorKTP?: string | null;
    nomorNPWP?: string | null;
    nomorBPJS?: string | null;
    emailPerusahaan?: string | null;
    emailPribadi?: string | null;
    nomorRekening?: string | null;
    namaBank?: string | null;
    namaRekening?: string | null;
    tanggalMasuk?: string | null;
    tanggalKeluar?: string | null;
    createdAt: string;
    updatedAt: string;

    // Relations
    divisiId?: string | null;
    departmentId?: string | null;
    posisiJabatanId?: string | null;
    statusKaryawanId?: string | null;
    lokasiKerjaId?: string | null;
    tagId?: string | null;
    jenisHubunganKerjaId?: string | null;

    divisi?: Divisi | null;
    department?: Department | null;
    posisiJabatan?: PosisiJabatan | null;
    statusKaryawan?: StatusKaryawan | null;
    lokasiKerja?: LokasiKerja | null;
    tag?: Tag | null;
    jenisHubunganKerja?: JenisHubunganKerja | null;

    // Child data
    anak?: Anak[];
    saudaraKandung?: SaudaraKandung[];
    dokumen?: DokumenKaryawan[];
}

export interface EmployeeListItem {
    id: string;
    namaLengkap: string;
    nomorIndukKaryawan: string;
    fotoKaryawan?: string | null;
    divisi?: Divisi | null;
    department?: Department | null;
    posisiJabatan?: PosisiJabatan | null;
    statusKaryawan?: StatusKaryawan | null;
}

// DTO INTERFACES
// ==========================================

export interface CreateEmployeeDTO {
    namaLengkap: string;
    nomorIndukKaryawan: string;
    nomorHandphone: string;
    jenisKelamin?: JenisKelamin;
    tempatLahir?: string;
    tanggalLahir?: string;
    agama?: Agama;
    golonganDarah?: GolonganDarah;
    statusPernikahan?: StatusPernikahan;
    alamatKTP?: string;
    alamatDomisili?: string;
    nomorKTP?: string;
    nomorNPWP?: string;
    nomorBPJS?: string;
    emailPerusahaan?: string;
    emailPribadi?: string;
    nomorRekening?: string;
    namaBank?: string;
    namaRekening?: string;
    tanggalMasuk?: string;
    divisiId?: string;
    departmentId?: string;
    posisiJabatanId?: string;
    statusKaryawanId?: string;
    lokasiKerjaId?: string;
    tagId?: string;
    jenisHubunganKerjaId?: string;

    // Additional Personal Info Fields
    nomorKartuKeluarga?: string;
    kotaDomisili?: string;
    provinsiDomisili?: string;
    kotaKTP?: string;
    provinsiKTP?: string;
    nomorHandphone2?: string;
    nomorTeleponRumah1?: string;
    nomorTeleponRumah2?: string;
    namaPasangan?: string;
    tanggalMenikah?: string;
    tanggalCerai?: string;
    tanggalWafatPasangan?: string;
    pekerjaanPasangan?: string;
    jumlahAnak?: number;
    cabangBank?: string;
    namaPemegangRekening?: string;
}

export interface UpdateEmployeeDTO extends Partial<Omit<CreateEmployeeDTO, 'nomorIndukKaryawan'>> { }

export interface CreateAnakDTO {
    urutanAnak: number;
    namaAnak: string;
    jenisKelamin: JenisKelamin;
    tanggalLahir?: string;
    keterangan?: string;
}

export interface CreateSaudaraKandungDTO {
    urutanSaudara: number;
    namaSaudaraKandung: string;
    jenisKelamin: JenisKelamin;
    tanggalLahir?: string;
    pekerjaan?: string;
}

// ==========================================
// QUERY & RESPONSE INTERFACES
// ==========================================

export interface EmployeeQueryParams {
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

export interface PaginatedEmployeeResponse {
    success: boolean;
    data: EmployeeListItem[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface EmployeeResponse {
    success: boolean;
    data: Employee;
    message?: string;
}

export interface QRCodeResponse {
    success: boolean;
    data: {
        qrcode: string;
        nik: string;
    };
    message?: string;
}

// ==========================================
// PERSONAL INFORMATION FORM DATA
// ==========================================

export interface PersonalInformationFormData {
    // Group 1: Biodata
    namaLengkap: string;
    jenisKelamin: JenisKelamin | '';
    tempatLahir: string;
    tanggalLahir: string;
    emailPribadi: string;

    // Group 2: Identifikasi
    agama: Agama | '';
    golonganDarah: GolonganDarah | '';
    nomorKartuKeluarga: string;
    nomorKTP: string;
    nomorNPWP: string;
    nomorBPJS: string;

    // Group 3: Alamat Domisili
    alamatDomisili: string;
    kotaDomisili: string;
    provinsiDomisili: string;

    // Group 4: Alamat KTP
    alamatKTP: string;
    kotaKTP: string;
    provinsiKTP: string;

    // Group 5: Kontak
    nomorHandphone: string;
    nomorHandphone2: string;
    nomorTeleponRumah1: string;
    nomorTeleponRumah2: string;

    // Group 6: Status Pernikahan
    statusPernikahan: StatusPernikahan | '';
    namaPasangan: string;
    tanggalMenikah: string;
    tanggalCerai: string;
    tanggalWafatPasangan: string;
    pekerjaanPasangan: string;
    jumlahAnak: number | '';

    // Group 7: Rekening Bank
    nomorRekening: string;
    namaRekening: string;
    namaBank: string;
    cabangBank: string;
}

// ==========================================
// HR INFORMATION FORM DATA
// ==========================================

export interface HRInformationFormData {
    // Section 1: Kepegawaian (read-only from header)
    nomorIndukKaryawan: string;
    posisiJabatanId: string;
    divisiId: string;
    departmentId: string;
    emailPerusahaan: string;
    managerId: string;
    atasanLangsungId: string;

    // Section 2: Kontrak
    jenisHubunganKerjaId: string;
    tanggalMasukGroup: string;
    tanggalMasuk: string;
    tanggalPermanent: string;
    tanggalKontrak: string;
    tanggalAkhirKontrak: string;
    tanggalBerhenti: string;

    // Section 3: Education
    tingkatPendidikan: TingkatPendidikan | '';
    bidangStudi: string;
    namaSekolah: string;
    kotaSekolah: string;
    statusKelulusan: StatusKelulusan | '';
    keteranganPendidikan: string;

    // Section 4: Pangkat dan Golongan
    kategoriPangkatId: string;
    golonganPangkatId: string;
    subGolonganPangkatId: string;
    noDanaPensiun: string;

    // Section 5: Kontak Darurat
    namaKontakDarurat1: string;
    nomorTeleponKontakDarurat1: string;
    hubunganKontakDarurat1: string;
    alamatKontakDarurat1: string;
    namaKontakDarurat2: string;
    nomorTeleponKontakDarurat2: string;
    hubunganKontakDarurat2: string;
    alamatKontakDarurat2: string;

    // Section 6: POO/POH & Seragam
    pointOfOriginal: string;
    pointOfHire: string;
    ukuranSeragamKerja: string;
    ukuranSepatuKerja: string;

    // Section 7: Pergerakan Karyawan
    lokasiSebelumnyaId: string;
    tanggalMutasi: string;

    // Section 8: Costing
    siklusPembayaranGaji: string;
    costing: string;
    assign: string;
    actual: string;
}
