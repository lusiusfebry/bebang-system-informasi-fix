/**
 * HR Master Data Zod Validation Schemas
 * Untuk validasi input pada API endpoints
 */

import { z } from 'zod';

// ==========================================
// Common Enums & Patterns
// ==========================================

const statusMasterEnum = z.enum(['AKTIF', 'TIDAK_AKTIF']).default('AKTIF');
const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;

// ==========================================
// Divisi Schemas
// ==========================================

export const createDivisiSchema = z.object({
    namaDivisi: z.string().min(1, 'Nama divisi wajib diisi').max(100),
    keterangan: z.string().max(500).optional(),
    status: statusMasterEnum,
});

export const updateDivisiSchema = createDivisiSchema.partial();

// ==========================================
// Department Schemas
// ==========================================

export const createDepartmentSchema = z.object({
    namaDepartment: z.string().min(1, 'Nama department wajib diisi').max(100),
    managerId: z.string().uuid('Manager ID harus valid UUID').optional().nullable(),
    divisiId: z.string().uuid('Divisi ID harus valid UUID'),
    keterangan: z.string().max(500).optional(),
    status: statusMasterEnum,
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

// ==========================================
// Posisi Jabatan Schemas
// ==========================================

export const createPosisiJabatanSchema = z.object({
    namaPosisiJabatan: z.string().min(1, 'Nama posisi jabatan wajib diisi').max(100),
    departmentId: z.string().uuid('Department ID harus valid UUID'),
    keterangan: z.string().max(500).optional(),
    status: statusMasterEnum,
});

export const updatePosisiJabatanSchema = createPosisiJabatanSchema.partial();

// ==========================================
// Kategori Pangkat Schemas
// ==========================================

export const createKategoriPangkatSchema = z.object({
    namaKategoriPangkat: z.string().min(1, 'Nama kategori pangkat wajib diisi').max(100),
    keterangan: z.string().max(500).optional(),
    status: statusMasterEnum,
});

export const updateKategoriPangkatSchema = createKategoriPangkatSchema.partial();

// ==========================================
// Golongan Schemas
// ==========================================

export const createGolonganSchema = z.object({
    namaGolongan: z.string().min(1, 'Nama golongan wajib diisi').max(100),
    keterangan: z.string().max(500).optional(),
    status: statusMasterEnum,
});

export const updateGolonganSchema = createGolonganSchema.partial();

// ==========================================
// Sub Golongan Schemas
// ==========================================

export const createSubGolonganSchema = z.object({
    namaSubGolongan: z.string().min(1, 'Nama sub golongan wajib diisi').max(100),
    keterangan: z.string().max(500).optional(),
    status: statusMasterEnum,
});

export const updateSubGolonganSchema = createSubGolonganSchema.partial();

// ==========================================
// Jenis Hubungan Kerja Schemas
// ==========================================

export const createJenisHubunganKerjaSchema = z.object({
    namaJenisHubunganKerja: z.string().min(1, 'Nama jenis hubungan kerja wajib diisi').max(100),
    keterangan: z.string().max(500).optional(),
    status: statusMasterEnum,
});

export const updateJenisHubunganKerjaSchema = createJenisHubunganKerjaSchema.partial();

// ==========================================
// Tag Schemas (dengan validasi warna hex)
// ==========================================

export const createTagSchema = z.object({
    namaTag: z.string().min(1, 'Nama tag wajib diisi').max(50),
    warnaTag: z.string().regex(hexColorPattern, 'Warna tag harus format hex (#RRGGBB)'),
    keterangan: z.string().max(500).optional(),
    status: statusMasterEnum,
});

export const updateTagSchema = createTagSchema.partial();

// ==========================================
// Lokasi Kerja Schemas
// ==========================================

export const createLokasiKerjaSchema = z.object({
    namaLokasiKerja: z.string().min(1, 'Nama lokasi kerja wajib diisi').max(100),
    alamat: z.string().max(500).optional(),
    keterangan: z.string().max(500).optional(),
    status: statusMasterEnum,
});

export const updateLokasiKerjaSchema = createLokasiKerjaSchema.partial();

// ==========================================
// Status Karyawan Schemas
// ==========================================

export const createStatusKaryawanSchema = z.object({
    namaStatus: z.string().min(1, 'Nama status wajib diisi').max(50),
    keterangan: z.string().max(500).optional(),
    status: statusMasterEnum,
});

export const updateStatusKaryawanSchema = createStatusKaryawanSchema.partial();

// ==========================================
// Query Parameter Schema (untuk filtering & pagination)
// ==========================================

export const masterDataQuerySchema = z.object({
    status: z.enum(['AKTIF', 'TIDAK_AKTIF']).optional(),
    search: z.string().max(100).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
});

// ==========================================
// Type Inference Exports
// ==========================================

export type CreateDivisiInput = z.infer<typeof createDivisiSchema>;
export type UpdateDivisiInput = z.infer<typeof updateDivisiSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type CreatePosisiJabatanInput = z.infer<typeof createPosisiJabatanSchema>;
export type UpdatePosisiJabatanInput = z.infer<typeof updatePosisiJabatanSchema>;
export type CreateKategoriPangkatInput = z.infer<typeof createKategoriPangkatSchema>;
export type UpdateKategoriPangkatInput = z.infer<typeof updateKategoriPangkatSchema>;
export type CreateGolonganInput = z.infer<typeof createGolonganSchema>;
export type UpdateGolonganInput = z.infer<typeof updateGolonganSchema>;
export type CreateSubGolonganInput = z.infer<typeof createSubGolonganSchema>;
export type UpdateSubGolonganInput = z.infer<typeof updateSubGolonganSchema>;
export type CreateJenisHubunganKerjaInput = z.infer<typeof createJenisHubunganKerjaSchema>;
export type UpdateJenisHubunganKerjaInput = z.infer<typeof updateJenisHubunganKerjaSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type CreateLokasiKerjaInput = z.infer<typeof createLokasiKerjaSchema>;
export type UpdateLokasiKerjaInput = z.infer<typeof updateLokasiKerjaSchema>;
export type CreateStatusKaryawanInput = z.infer<typeof createStatusKaryawanSchema>;
export type UpdateStatusKaryawanInput = z.infer<typeof updateStatusKaryawanSchema>;
export type MasterDataQueryInput = z.infer<typeof masterDataQuerySchema>;
