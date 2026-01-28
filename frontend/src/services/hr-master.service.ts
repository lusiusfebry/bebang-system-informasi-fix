/**
 * HR Master Data Service
 * API calls untuk semua master data HR entities
 */

import api from './api';
import type {
    HRMasterEntityType,
    MasterDataQueryParams,
    MasterDataResponse,
    SingleDataResponse,
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
} from '../types/hr-master.types';

const BASE_URL = '/hr/master';

// ==========================================
// GENERIC CRUD FUNCTIONS
// ==========================================

/**
 * Get all items for a specific entity with pagination and filters
 */
export async function getAll<T>(
    entity: HRMasterEntityType,
    params?: MasterDataQueryParams
): Promise<MasterDataResponse<T>> {
    const response = await api.get(`${BASE_URL}/${entity}`, { params });
    return response.data;
}

/**
 * Get single item by ID
 */
export async function getById<T>(
    entity: HRMasterEntityType,
    id: string
): Promise<SingleDataResponse<T>> {
    const response = await api.get(`${BASE_URL}/${entity}/${id}`);
    return response.data;
}

/**
 * Create new item
 */
export async function create<T, D>(
    entity: HRMasterEntityType,
    data: D
): Promise<SingleDataResponse<T>> {
    const response = await api.post(`${BASE_URL}/${entity}`, data);
    return response.data;
}

/**
 * Update existing item
 */
export async function update<T, D>(
    entity: HRMasterEntityType,
    id: string,
    data: D
): Promise<SingleDataResponse<T>> {
    const response = await api.put(`${BASE_URL}/${entity}/${id}`, data);
    return response.data;
}

/**
 * Delete (soft delete) item
 */
export async function remove<T>(
    entity: HRMasterEntityType,
    id: string
): Promise<SingleDataResponse<T>> {
    const response = await api.delete(`${BASE_URL}/${entity}/${id}`);
    return response.data;
}

// ==========================================
// DIVISI
// ==========================================

export const divisiService = {
    getAll: (params?: MasterDataQueryParams) => getAll<Divisi>('divisi', params),
    getById: (id: string) => getById<Divisi>('divisi', id),
    create: <D>(data: D) => create<Divisi, D>('divisi', data),
    update: <D>(id: string, data: D) => update<Divisi, D>('divisi', id, data),
    delete: (id: string) => remove<Divisi>('divisi', id),
};

// ==========================================
// DEPARTMENT
// ==========================================

export const departmentService = {
    getAll: (params?: MasterDataQueryParams) => getAll<Department>('department', params),
    getById: (id: string) => getById<Department>('department', id),
    create: <D>(data: D) => create<Department, D>('department', data),
    update: <D>(id: string, data: D) => update<Department, D>('department', id, data),
    delete: (id: string) => remove<Department>('department', id),
};

// ==========================================
// POSISI JABATAN
// ==========================================

export const posisiJabatanService = {
    getAll: (params?: MasterDataQueryParams) => getAll<PosisiJabatan>('posisi-jabatan', params),
    getById: (id: string) => getById<PosisiJabatan>('posisi-jabatan', id),
    create: <D>(data: D) => create<PosisiJabatan, D>('posisi-jabatan', data),
    update: <D>(id: string, data: D) => update<PosisiJabatan, D>('posisi-jabatan', id, data),
    delete: (id: string) => remove<PosisiJabatan>('posisi-jabatan', id),
};

// ==========================================
// KATEGORI PANGKAT
// ==========================================

export const kategoriPangkatService = {
    getAll: (params?: MasterDataQueryParams) => getAll<KategoriPangkat>('kategori-pangkat', params),
    getById: (id: string) => getById<KategoriPangkat>('kategori-pangkat', id),
    create: <D>(data: D) => create<KategoriPangkat, D>('kategori-pangkat', data),
    update: <D>(id: string, data: D) => update<KategoriPangkat, D>('kategori-pangkat', id, data),
    delete: (id: string) => remove<KategoriPangkat>('kategori-pangkat', id),
};

// ==========================================
// GOLONGAN
// ==========================================

export const golonganService = {
    getAll: (params?: MasterDataQueryParams) => getAll<Golongan>('golongan', params),
    getById: (id: string) => getById<Golongan>('golongan', id),
    create: <D>(data: D) => create<Golongan, D>('golongan', data),
    update: <D>(id: string, data: D) => update<Golongan, D>('golongan', id, data),
    delete: (id: string) => remove<Golongan>('golongan', id),
};

// ==========================================
// SUB GOLONGAN
// ==========================================

export const subGolonganService = {
    getAll: (params?: MasterDataQueryParams) => getAll<SubGolongan>('sub-golongan', params),
    getById: (id: string) => getById<SubGolongan>('sub-golongan', id),
    create: <D>(data: D) => create<SubGolongan, D>('sub-golongan', data),
    update: <D>(id: string, data: D) => update<SubGolongan, D>('sub-golongan', id, data),
    delete: (id: string) => remove<SubGolongan>('sub-golongan', id),
};

// ==========================================
// JENIS HUBUNGAN KERJA
// ==========================================

export const jenisHubunganKerjaService = {
    getAll: (params?: MasterDataQueryParams) => getAll<JenisHubunganKerja>('jenis-hubungan-kerja', params),
    getById: (id: string) => getById<JenisHubunganKerja>('jenis-hubungan-kerja', id),
    create: <D>(data: D) => create<JenisHubunganKerja, D>('jenis-hubungan-kerja', data),
    update: <D>(id: string, data: D) => update<JenisHubunganKerja, D>('jenis-hubungan-kerja', id, data),
    delete: (id: string) => remove<JenisHubunganKerja>('jenis-hubungan-kerja', id),
};

// ==========================================
// TAG
// ==========================================

export const tagService = {
    getAll: (params?: MasterDataQueryParams) => getAll<Tag>('tag', params),
    getById: (id: string) => getById<Tag>('tag', id),
    create: <D>(data: D) => create<Tag, D>('tag', data),
    update: <D>(id: string, data: D) => update<Tag, D>('tag', id, data),
    delete: (id: string) => remove<Tag>('tag', id),
};

// ==========================================
// LOKASI KERJA
// ==========================================

export const lokasiKerjaService = {
    getAll: (params?: MasterDataQueryParams) => getAll<LokasiKerja>('lokasi-kerja', params),
    getById: (id: string) => getById<LokasiKerja>('lokasi-kerja', id),
    create: <D>(data: D) => create<LokasiKerja, D>('lokasi-kerja', data),
    update: <D>(id: string, data: D) => update<LokasiKerja, D>('lokasi-kerja', id, data),
    delete: (id: string) => remove<LokasiKerja>('lokasi-kerja', id),
};

// ==========================================
// STATUS KARYAWAN
// ==========================================

export const statusKaryawanService = {
    getAll: (params?: MasterDataQueryParams) => getAll<StatusKaryawan>('status-karyawan', params),
    getById: (id: string) => getById<StatusKaryawan>('status-karyawan', id),
    create: <D>(data: D) => create<StatusKaryawan, D>('status-karyawan', data),
    update: <D>(id: string, data: D) => update<StatusKaryawan, D>('status-karyawan', id, data),
    delete: (id: string) => remove<StatusKaryawan>('status-karyawan', id),
};

// ==========================================
// SERVICE MAP
// ==========================================

export const hrMasterServiceMap = {
    divisi: divisiService,
    department: departmentService,
    'posisi-jabatan': posisiJabatanService,
    'kategori-pangkat': kategoriPangkatService,
    golongan: golonganService,
    'sub-golongan': subGolonganService,
    'jenis-hubungan-kerja': jenisHubunganKerjaService,
    tag: tagService,
    'lokasi-kerja': lokasiKerjaService,
    'status-karyawan': statusKaryawanService,
} as const;
