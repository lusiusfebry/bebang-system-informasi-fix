/**
 * HR Master Data Types
 * TypeScript interfaces untuk semua master data HR entities
 */

// Status Master enum
export type StatusMaster = 'AKTIF' | 'TIDAK_AKTIF';

// Base master data interface
export interface BaseMasterData {
    id: string;
    status: StatusMaster;
    createdAt: string;
    updatedAt: string;
}

// ==========================================
// DIVISI
// ==========================================

export interface Divisi extends BaseMasterData {
    namaDivisi: string;
    keterangan?: string;
}

export interface CreateDivisiInput {
    namaDivisi: string;
    keterangan?: string;
    status?: StatusMaster;
}

export interface UpdateDivisiInput {
    namaDivisi?: string;
    keterangan?: string;
    status?: StatusMaster;
}

// ==========================================
// DEPARTMENT
// ==========================================

export interface Department extends BaseMasterData {
    namaDepartment: string;
    namaManager?: string;
    divisiId?: string;
    keterangan?: string;
    divisi?: Divisi;
}

export interface CreateDepartmentInput {
    namaDepartment: string;
    namaManager?: string;
    divisiId?: string;
    keterangan?: string;
    status?: StatusMaster;
}

export interface UpdateDepartmentInput {
    namaDepartment?: string;
    namaManager?: string;
    divisiId?: string;
    keterangan?: string;
    status?: StatusMaster;
}

// ==========================================
// POSISI JABATAN
// ==========================================

export interface PosisiJabatan extends BaseMasterData {
    namaPosisiJabatan: string;
    departmentId?: string;
    keterangan?: string;
    department?: Department;
}

export interface CreatePosisiJabatanInput {
    namaPosisiJabatan: string;
    departmentId?: string;
    keterangan?: string;
    status?: StatusMaster;
}

export interface UpdatePosisiJabatanInput {
    namaPosisiJabatan?: string;
    departmentId?: string;
    keterangan?: string;
    status?: StatusMaster;
}

// ==========================================
// KATEGORI PANGKAT
// ==========================================

export interface KategoriPangkat extends BaseMasterData {
    namaKategoriPangkat: string;
    keterangan?: string;
}

export interface CreateKategoriPangkatInput {
    namaKategoriPangkat: string;
    keterangan?: string;
    status?: StatusMaster;
}

export interface UpdateKategoriPangkatInput {
    namaKategoriPangkat?: string;
    keterangan?: string;
    status?: StatusMaster;
}

// ==========================================
// GOLONGAN
// ==========================================

export interface Golongan extends BaseMasterData {
    namaGolongan: string;
    keterangan?: string;
}

export interface CreateGolonganInput {
    namaGolongan: string;
    keterangan?: string;
    status?: StatusMaster;
}

export interface UpdateGolonganInput {
    namaGolongan?: string;
    keterangan?: string;
    status?: StatusMaster;
}

// ==========================================
// SUB GOLONGAN
// ==========================================

export interface SubGolongan extends BaseMasterData {
    namaSubGolongan: string;
    keterangan?: string;
}

export interface CreateSubGolonganInput {
    namaSubGolongan: string;
    keterangan?: string;
    status?: StatusMaster;
}

export interface UpdateSubGolonganInput {
    namaSubGolongan?: string;
    keterangan?: string;
    status?: StatusMaster;
}

// ==========================================
// JENIS HUBUNGAN KERJA
// ==========================================

export interface JenisHubunganKerja extends BaseMasterData {
    namaJenisHubunganKerja: string;
    keterangan?: string;
}

export interface CreateJenisHubunganKerjaInput {
    namaJenisHubunganKerja: string;
    keterangan?: string;
    status?: StatusMaster;
}

export interface UpdateJenisHubunganKerjaInput {
    namaJenisHubunganKerja?: string;
    keterangan?: string;
    status?: StatusMaster;
}

// ==========================================
// TAG
// ==========================================

export interface Tag extends BaseMasterData {
    namaTag: string;
    warnaTag: string;
    keterangan?: string;
}

export interface CreateTagInput {
    namaTag: string;
    warnaTag: string;
    keterangan?: string;
    status?: StatusMaster;
}

export interface UpdateTagInput {
    namaTag?: string;
    warnaTag?: string;
    keterangan?: string;
    status?: StatusMaster;
}

// ==========================================
// LOKASI KERJA
// ==========================================

export interface LokasiKerja extends BaseMasterData {
    namaLokasiKerja: string;
    alamat?: string;
    keterangan?: string;
}

export interface CreateLokasiKerjaInput {
    namaLokasiKerja: string;
    alamat?: string;
    keterangan?: string;
    status?: StatusMaster;
}

export interface UpdateLokasiKerjaInput {
    namaLokasiKerja?: string;
    alamat?: string;
    keterangan?: string;
    status?: StatusMaster;
}

// ==========================================
// STATUS KARYAWAN
// ==========================================

export interface StatusKaryawan extends BaseMasterData {
    namaStatus: string;
    keterangan?: string;
}

export interface CreateStatusKaryawanInput {
    namaStatus: string;
    keterangan?: string;
    status?: StatusMaster;
}

export interface UpdateStatusKaryawanInput {
    namaStatus?: string;
    keterangan?: string;
    status?: StatusMaster;
}

// ==========================================
// QUERY & PAGINATION TYPES
// ==========================================

export interface MasterDataQueryParams {
    page?: number;
    limit?: number;
    status?: StatusMaster;
    search?: string;
    divisiId?: string;
    departmentId?: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface MasterDataResponse<T> {
    success: boolean;
    data: T[];
    meta: PaginationMeta;
}

export interface SingleDataResponse<T> {
    success: boolean;
    data: T;
}

// Entity types for generic hooks
export type HRMasterEntityType =
    | 'divisi'
    | 'department'
    | 'posisi-jabatan'
    | 'kategori-pangkat'
    | 'golongan'
    | 'sub-golongan'
    | 'jenis-hubungan-kerja'
    | 'tag'
    | 'lokasi-kerja'
    | 'status-karyawan';

// Union type for all master data
export type HRMasterData =
    | Divisi
    | Department
    | PosisiJabatan
    | KategoriPangkat
    | Golongan
    | SubGolongan
    | JenisHubunganKerja
    | Tag
    | LokasiKerja
    | StatusKaryawan;
