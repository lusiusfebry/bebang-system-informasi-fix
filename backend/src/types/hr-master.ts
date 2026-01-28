/**
 * HR Master Data Types
 * Auto-generated from Prisma schema, with DTOs for CRUD operations
 */

// Re-export from Prisma Client
export type {
    Divisi,
    Department,
    PosisiJabatan,
    KategoriPangkat,
    Golongan,
    SubGolongan,
    JenisHubunganKerja,
    Tag,
    LokasiKerja,
    StatusKaryawan,
    StatusMaster,
} from '@prisma/client';

// ==========================================
// DTOs for Create Operations (tanpa id, timestamps)
// ==========================================

export interface CreateDivisiDTO {
    namaDivisi: string;
    keterangan?: string;
    status?: 'AKTIF' | 'TIDAK_AKTIF';
}

export interface CreateDepartmentDTO {
    namaDepartment: string;
    managerId?: string | null;
    divisiId: string;
    keterangan?: string;
    status?: 'AKTIF' | 'TIDAK_AKTIF';
}

export interface CreatePosisiJabatanDTO {
    namaPosisiJabatan: string;
    departmentId: string;
    keterangan?: string;
    status?: 'AKTIF' | 'TIDAK_AKTIF';
}

export interface CreateKategoriPangkatDTO {
    namaKategoriPangkat: string;
    keterangan?: string;
    status?: 'AKTIF' | 'TIDAK_AKTIF';
}

export interface CreateGolonganDTO {
    namaGolongan: string;
    keterangan?: string;
    status?: 'AKTIF' | 'TIDAK_AKTIF';
}

export interface CreateSubGolonganDTO {
    namaSubGolongan: string;
    keterangan?: string;
    status?: 'AKTIF' | 'TIDAK_AKTIF';
}

export interface CreateJenisHubunganKerjaDTO {
    namaJenisHubunganKerja: string;
    keterangan?: string;
    status?: 'AKTIF' | 'TIDAK_AKTIF';
}

export interface CreateTagDTO {
    namaTag: string;
    warnaTag: string;
    keterangan?: string;
    status?: 'AKTIF' | 'TIDAK_AKTIF';
}

export interface CreateLokasiKerjaDTO {
    namaLokasiKerja: string;
    alamat?: string;
    keterangan?: string;
    status?: 'AKTIF' | 'TIDAK_AKTIF';
}

export interface CreateStatusKaryawanDTO {
    namaStatus: string;
    keterangan?: string;
    status?: 'AKTIF' | 'TIDAK_AKTIF';
}

// ==========================================
// DTOs for Update Operations (all fields optional)
// ==========================================

export type UpdateDivisiDTO = Partial<CreateDivisiDTO>;
export type UpdateDepartmentDTO = Partial<CreateDepartmentDTO>;
export type UpdatePosisiJabatanDTO = Partial<CreatePosisiJabatanDTO>;
export type UpdateKategoriPangkatDTO = Partial<CreateKategoriPangkatDTO>;
export type UpdateGolonganDTO = Partial<CreateGolonganDTO>;
export type UpdateSubGolonganDTO = Partial<CreateSubGolonganDTO>;
export type UpdateJenisHubunganKerjaDTO = Partial<CreateJenisHubunganKerjaDTO>;
export type UpdateTagDTO = Partial<CreateTagDTO>;
export type UpdateLokasiKerjaDTO = Partial<CreateLokasiKerjaDTO>;
export type UpdateStatusKaryawanDTO = Partial<CreateStatusKaryawanDTO>;

// ==========================================
// Query/Filter Types
// ==========================================

export interface MasterDataQueryParams {
    status?: 'AKTIF' | 'TIDAK_AKTIF';
    search?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
