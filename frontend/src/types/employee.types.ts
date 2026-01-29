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

// ==========================================
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
