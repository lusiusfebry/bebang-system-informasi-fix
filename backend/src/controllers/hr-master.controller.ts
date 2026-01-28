/**
 * HR Master Data Controller
 * Controller functions untuk semua 10 master data HR entities
 */

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import {
    divisiService,
    departmentService,
    posisiJabatanService,
    kategoriPangkatService,
    golonganService,
    subGolonganService,
    jenisHubunganKerjaService,
    tagService,
    lokasiKerjaService,
    statusKaryawanService,
} from '../services/hr-master.service';

// ==========================================
// Response Helpers
// ==========================================

const successResponse = (res: Response, data: unknown, message?: string, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        data,
        ...(message && { message }),
    });
};

const paginatedResponse = (
    res: Response,
    data: unknown[],
    meta: { page: number; limit: number; total: number; totalPages: number }
) => {
    res.status(200).json({
        success: true,
        data,
        meta,
    });
};

// ==========================================
// Error Handling Helpers
// ==========================================

const handlePrismaError = (error: unknown, res: Response, next: NextFunction, entityName: string) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002': // Unique constraint violation
                res.status(409).json({
                    success: false,
                    error: { message: `${entityName} dengan data tersebut sudah ada` },
                });
                return;
            case 'P2025': // Record not found
                res.status(404).json({
                    success: false,
                    error: { message: `${entityName} tidak ditemukan` },
                });
                return;
            case 'P2003': // Foreign key constraint violation
                res.status(400).json({
                    success: false,
                    error: { message: `Referensi data tidak valid. Pastikan relasi data sudah benar.` },
                });
                return;
        }
    }
    next(error);
};

// ==========================================
// DIVISI CONTROLLER
// ==========================================

export const getAllDivisi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query;
        const result = await divisiService.findAll(
            { status: status as 'AKTIF' | 'TIDAK_AKTIF', search: search as string },
            { page: parseInt(page as string), limit: parseInt(limit as string) }
        );
        paginatedResponse(res, result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        });
    } catch (error) {
        next(error);
    }
};

export const getDivisiById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const divisi = await divisiService.findById(id);
        if (!divisi) {
            res.status(404).json({ success: false, error: { message: 'Divisi tidak ditemukan' } });
            return;
        }
        successResponse(res, divisi);
    } catch (error) {
        next(error);
    }
};

export const createDivisi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const divisi = await divisiService.create(req.body);
        successResponse(res, divisi, 'Divisi berhasil dibuat', 201);
    } catch (error) {
        handlePrismaError(error, res, next, 'Divisi');
    }
};

export const updateDivisi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await divisiService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Divisi tidak ditemukan' } });
            return;
        }
        const divisi = await divisiService.update(id, req.body);
        successResponse(res, divisi, 'Divisi berhasil diupdate');
    } catch (error) {
        handlePrismaError(error, res, next, 'Divisi');
    }
};

export const deleteDivisi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await divisiService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Divisi tidak ditemukan' } });
            return;
        }
        await divisiService.softDelete(id);
        successResponse(res, null, 'Divisi berhasil dihapus (soft delete)');
    } catch (error) {
        handlePrismaError(error, res, next, 'Divisi');
    }
};

// ==========================================
// DEPARTMENT CONTROLLER
// ==========================================

export const getAllDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query;
        const result = await departmentService.findAll(
            { status: status as 'AKTIF' | 'TIDAK_AKTIF', search: search as string },
            { page: parseInt(page as string), limit: parseInt(limit as string) }
        );
        paginatedResponse(res, result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        });
    } catch (error) {
        next(error);
    }
};

export const getDepartmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const department = await departmentService.findById(id);
        if (!department) {
            res.status(404).json({ success: false, error: { message: 'Department tidak ditemukan' } });
            return;
        }
        successResponse(res, department);
    } catch (error) {
        next(error);
    }
};

export const createDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const department = await departmentService.create(req.body);
        successResponse(res, department, 'Department berhasil dibuat', 201);
    } catch (error) {
        handlePrismaError(error, res, next, 'Department');
    }
};

export const updateDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await departmentService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Department tidak ditemukan' } });
            return;
        }
        const department = await departmentService.update(id, req.body);
        successResponse(res, department, 'Department berhasil diupdate');
    } catch (error) {
        handlePrismaError(error, res, next, 'Department');
    }
};

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await departmentService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Department tidak ditemukan' } });
            return;
        }
        await departmentService.softDelete(id);
        successResponse(res, null, 'Department berhasil dihapus (soft delete)');
    } catch (error) {
        handlePrismaError(error, res, next, 'Department');
    }
};

// ==========================================
// POSISI JABATAN CONTROLLER
// ==========================================

export const getAllPosisiJabatan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query;
        const result = await posisiJabatanService.findAll(
            { status: status as 'AKTIF' | 'TIDAK_AKTIF', search: search as string },
            { page: parseInt(page as string), limit: parseInt(limit as string) }
        );
        paginatedResponse(res, result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        });
    } catch (error) {
        next(error);
    }
};

export const getPosisiJabatanById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const posisiJabatan = await posisiJabatanService.findById(id);
        if (!posisiJabatan) {
            res.status(404).json({ success: false, error: { message: 'Posisi Jabatan tidak ditemukan' } });
            return;
        }
        successResponse(res, posisiJabatan);
    } catch (error) {
        next(error);
    }
};

export const createPosisiJabatan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const posisiJabatan = await posisiJabatanService.create(req.body);
        successResponse(res, posisiJabatan, 'Posisi Jabatan berhasil dibuat', 201);
    } catch (error) {
        handlePrismaError(error, res, next, 'Posisi Jabatan');
    }
};

export const updatePosisiJabatan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await posisiJabatanService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Posisi Jabatan tidak ditemukan' } });
            return;
        }
        const posisiJabatan = await posisiJabatanService.update(id, req.body);
        successResponse(res, posisiJabatan, 'Posisi Jabatan berhasil diupdate');
    } catch (error) {
        handlePrismaError(error, res, next, 'Posisi Jabatan');
    }
};

export const deletePosisiJabatan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await posisiJabatanService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Posisi Jabatan tidak ditemukan' } });
            return;
        }
        await posisiJabatanService.softDelete(id);
        successResponse(res, null, 'Posisi Jabatan berhasil dihapus (soft delete)');
    } catch (error) {
        handlePrismaError(error, res, next, 'Posisi Jabatan');
    }
};

// ==========================================
// KATEGORI PANGKAT CONTROLLER
// ==========================================

export const getAllKategoriPangkat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query;
        const result = await kategoriPangkatService.findAll(
            { status: status as 'AKTIF' | 'TIDAK_AKTIF', search: search as string },
            { page: parseInt(page as string), limit: parseInt(limit as string) }
        );
        paginatedResponse(res, result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        });
    } catch (error) {
        next(error);
    }
};

export const getKategoriPangkatById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const kategoriPangkat = await kategoriPangkatService.findById(id);
        if (!kategoriPangkat) {
            res.status(404).json({ success: false, error: { message: 'Kategori Pangkat tidak ditemukan' } });
            return;
        }
        successResponse(res, kategoriPangkat);
    } catch (error) {
        next(error);
    }
};

export const createKategoriPangkat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const kategoriPangkat = await kategoriPangkatService.create(req.body);
        successResponse(res, kategoriPangkat, 'Kategori Pangkat berhasil dibuat', 201);
    } catch (error) {
        handlePrismaError(error, res, next, 'Kategori Pangkat');
    }
};

export const updateKategoriPangkat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await kategoriPangkatService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Kategori Pangkat tidak ditemukan' } });
            return;
        }
        const kategoriPangkat = await kategoriPangkatService.update(id, req.body);
        successResponse(res, kategoriPangkat, 'Kategori Pangkat berhasil diupdate');
    } catch (error) {
        handlePrismaError(error, res, next, 'Kategori Pangkat');
    }
};

export const deleteKategoriPangkat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await kategoriPangkatService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Kategori Pangkat tidak ditemukan' } });
            return;
        }
        await kategoriPangkatService.softDelete(id);
        successResponse(res, null, 'Kategori Pangkat berhasil dihapus (soft delete)');
    } catch (error) {
        handlePrismaError(error, res, next, 'Kategori Pangkat');
    }
};

// ==========================================
// GOLONGAN CONTROLLER
// ==========================================

export const getAllGolongan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query;
        const result = await golonganService.findAll(
            { status: status as 'AKTIF' | 'TIDAK_AKTIF', search: search as string },
            { page: parseInt(page as string), limit: parseInt(limit as string) }
        );
        paginatedResponse(res, result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        });
    } catch (error) {
        next(error);
    }
};

export const getGolonganById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const golongan = await golonganService.findById(id);
        if (!golongan) {
            res.status(404).json({ success: false, error: { message: 'Golongan tidak ditemukan' } });
            return;
        }
        successResponse(res, golongan);
    } catch (error) {
        next(error);
    }
};

export const createGolongan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const golongan = await golonganService.create(req.body);
        successResponse(res, golongan, 'Golongan berhasil dibuat', 201);
    } catch (error) {
        handlePrismaError(error, res, next, 'Golongan');
    }
};

export const updateGolongan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await golonganService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Golongan tidak ditemukan' } });
            return;
        }
        const golongan = await golonganService.update(id, req.body);
        successResponse(res, golongan, 'Golongan berhasil diupdate');
    } catch (error) {
        handlePrismaError(error, res, next, 'Golongan');
    }
};

export const deleteGolongan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await golonganService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Golongan tidak ditemukan' } });
            return;
        }
        await golonganService.softDelete(id);
        successResponse(res, null, 'Golongan berhasil dihapus (soft delete)');
    } catch (error) {
        handlePrismaError(error, res, next, 'Golongan');
    }
};

// ==========================================
// SUB GOLONGAN CONTROLLER
// ==========================================

export const getAllSubGolongan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query;
        const result = await subGolonganService.findAll(
            { status: status as 'AKTIF' | 'TIDAK_AKTIF', search: search as string },
            { page: parseInt(page as string), limit: parseInt(limit as string) }
        );
        paginatedResponse(res, result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        });
    } catch (error) {
        next(error);
    }
};

export const getSubGolonganById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const subGolongan = await subGolonganService.findById(id);
        if (!subGolongan) {
            res.status(404).json({ success: false, error: { message: 'Sub Golongan tidak ditemukan' } });
            return;
        }
        successResponse(res, subGolongan);
    } catch (error) {
        next(error);
    }
};

export const createSubGolongan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const subGolongan = await subGolonganService.create(req.body);
        successResponse(res, subGolongan, 'Sub Golongan berhasil dibuat', 201);
    } catch (error) {
        handlePrismaError(error, res, next, 'Sub Golongan');
    }
};

export const updateSubGolongan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await subGolonganService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Sub Golongan tidak ditemukan' } });
            return;
        }
        const subGolongan = await subGolonganService.update(id, req.body);
        successResponse(res, subGolongan, 'Sub Golongan berhasil diupdate');
    } catch (error) {
        handlePrismaError(error, res, next, 'Sub Golongan');
    }
};

export const deleteSubGolongan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await subGolonganService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Sub Golongan tidak ditemukan' } });
            return;
        }
        await subGolonganService.softDelete(id);
        successResponse(res, null, 'Sub Golongan berhasil dihapus (soft delete)');
    } catch (error) {
        handlePrismaError(error, res, next, 'Sub Golongan');
    }
};

// ==========================================
// JENIS HUBUNGAN KERJA CONTROLLER
// ==========================================

export const getAllJenisHubunganKerja = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query;
        const result = await jenisHubunganKerjaService.findAll(
            { status: status as 'AKTIF' | 'TIDAK_AKTIF', search: search as string },
            { page: parseInt(page as string), limit: parseInt(limit as string) }
        );
        paginatedResponse(res, result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        });
    } catch (error) {
        next(error);
    }
};

export const getJenisHubunganKerjaById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const jenisHubunganKerja = await jenisHubunganKerjaService.findById(id);
        if (!jenisHubunganKerja) {
            res.status(404).json({ success: false, error: { message: 'Jenis Hubungan Kerja tidak ditemukan' } });
            return;
        }
        successResponse(res, jenisHubunganKerja);
    } catch (error) {
        next(error);
    }
};

export const createJenisHubunganKerja = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jenisHubunganKerja = await jenisHubunganKerjaService.create(req.body);
        successResponse(res, jenisHubunganKerja, 'Jenis Hubungan Kerja berhasil dibuat', 201);
    } catch (error) {
        handlePrismaError(error, res, next, 'Jenis Hubungan Kerja');
    }
};

export const updateJenisHubunganKerja = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await jenisHubunganKerjaService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Jenis Hubungan Kerja tidak ditemukan' } });
            return;
        }
        const jenisHubunganKerja = await jenisHubunganKerjaService.update(id, req.body);
        successResponse(res, jenisHubunganKerja, 'Jenis Hubungan Kerja berhasil diupdate');
    } catch (error) {
        handlePrismaError(error, res, next, 'Jenis Hubungan Kerja');
    }
};

export const deleteJenisHubunganKerja = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await jenisHubunganKerjaService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Jenis Hubungan Kerja tidak ditemukan' } });
            return;
        }
        await jenisHubunganKerjaService.softDelete(id);
        successResponse(res, null, 'Jenis Hubungan Kerja berhasil dihapus (soft delete)');
    } catch (error) {
        handlePrismaError(error, res, next, 'Jenis Hubungan Kerja');
    }
};

// ==========================================
// TAG CONTROLLER
// ==========================================

export const getAllTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query;
        const result = await tagService.findAll(
            { status: status as 'AKTIF' | 'TIDAK_AKTIF', search: search as string },
            { page: parseInt(page as string), limit: parseInt(limit as string) }
        );
        paginatedResponse(res, result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        });
    } catch (error) {
        next(error);
    }
};

export const getTagById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const tag = await tagService.findById(id);
        if (!tag) {
            res.status(404).json({ success: false, error: { message: 'Tag tidak ditemukan' } });
            return;
        }
        successResponse(res, tag);
    } catch (error) {
        next(error);
    }
};

export const createTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tag = await tagService.create(req.body);
        successResponse(res, tag, 'Tag berhasil dibuat', 201);
    } catch (error) {
        handlePrismaError(error, res, next, 'Tag');
    }
};

export const updateTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await tagService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Tag tidak ditemukan' } });
            return;
        }
        const tag = await tagService.update(id, req.body);
        successResponse(res, tag, 'Tag berhasil diupdate');
    } catch (error) {
        handlePrismaError(error, res, next, 'Tag');
    }
};

export const deleteTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await tagService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Tag tidak ditemukan' } });
            return;
        }
        await tagService.softDelete(id);
        successResponse(res, null, 'Tag berhasil dihapus (soft delete)');
    } catch (error) {
        handlePrismaError(error, res, next, 'Tag');
    }
};

// ==========================================
// LOKASI KERJA CONTROLLER
// ==========================================

export const getAllLokasiKerja = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query;
        const result = await lokasiKerjaService.findAll(
            { status: status as 'AKTIF' | 'TIDAK_AKTIF', search: search as string },
            { page: parseInt(page as string), limit: parseInt(limit as string) }
        );
        paginatedResponse(res, result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        });
    } catch (error) {
        next(error);
    }
};

export const getLokasiKerjaById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const lokasiKerja = await lokasiKerjaService.findById(id);
        if (!lokasiKerja) {
            res.status(404).json({ success: false, error: { message: 'Lokasi Kerja tidak ditemukan' } });
            return;
        }
        successResponse(res, lokasiKerja);
    } catch (error) {
        next(error);
    }
};

export const createLokasiKerja = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lokasiKerja = await lokasiKerjaService.create(req.body);
        successResponse(res, lokasiKerja, 'Lokasi Kerja berhasil dibuat', 201);
    } catch (error) {
        handlePrismaError(error, res, next, 'Lokasi Kerja');
    }
};

export const updateLokasiKerja = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await lokasiKerjaService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Lokasi Kerja tidak ditemukan' } });
            return;
        }
        const lokasiKerja = await lokasiKerjaService.update(id, req.body);
        successResponse(res, lokasiKerja, 'Lokasi Kerja berhasil diupdate');
    } catch (error) {
        handlePrismaError(error, res, next, 'Lokasi Kerja');
    }
};

export const deleteLokasiKerja = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await lokasiKerjaService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Lokasi Kerja tidak ditemukan' } });
            return;
        }
        await lokasiKerjaService.softDelete(id);
        successResponse(res, null, 'Lokasi Kerja berhasil dihapus (soft delete)');
    } catch (error) {
        handlePrismaError(error, res, next, 'Lokasi Kerja');
    }
};

// ==========================================
// STATUS KARYAWAN CONTROLLER
// ==========================================

export const getAllStatusKaryawan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, search, page = '1', limit = '10' } = req.query;
        const result = await statusKaryawanService.findAll(
            { status: status as 'AKTIF' | 'TIDAK_AKTIF', search: search as string },
            { page: parseInt(page as string), limit: parseInt(limit as string) }
        );
        paginatedResponse(res, result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        });
    } catch (error) {
        next(error);
    }
};

export const getStatusKaryawanById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const statusKaryawan = await statusKaryawanService.findById(id);
        if (!statusKaryawan) {
            res.status(404).json({ success: false, error: { message: 'Status Karyawan tidak ditemukan' } });
            return;
        }
        successResponse(res, statusKaryawan);
    } catch (error) {
        next(error);
    }
};

export const createStatusKaryawan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const statusKaryawan = await statusKaryawanService.create(req.body);
        successResponse(res, statusKaryawan, 'Status Karyawan berhasil dibuat', 201);
    } catch (error) {
        handlePrismaError(error, res, next, 'Status Karyawan');
    }
};

export const updateStatusKaryawan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await statusKaryawanService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Status Karyawan tidak ditemukan' } });
            return;
        }
        const statusKaryawan = await statusKaryawanService.update(id, req.body);
        successResponse(res, statusKaryawan, 'Status Karyawan berhasil diupdate');
    } catch (error) {
        handlePrismaError(error, res, next, 'Status Karyawan');
    }
};

export const deleteStatusKaryawan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const existing = await statusKaryawanService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, error: { message: 'Status Karyawan tidak ditemukan' } });
            return;
        }
        await statusKaryawanService.softDelete(id);
        successResponse(res, null, 'Status Karyawan berhasil dihapus (soft delete)');
    } catch (error) {
        handlePrismaError(error, res, next, 'Status Karyawan');
    }
};
