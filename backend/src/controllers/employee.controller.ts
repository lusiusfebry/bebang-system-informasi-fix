/**
 * Employee Controller
 * Request handlers untuk Employee management endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { employeeService } from '../services/employee.service';
import { successResponse, paginatedResponse } from '../utils/response';
import {
    createKaryawanSchema,
    updateKaryawanSchema,
    createAnakSchema,
    updateAnakSchema,
    createSaudaraKandungSchema,
    updateSaudaraKandungSchema,
    karyawanQuerySchema,
} from '../validators/employee.validator';
import { generateEmployeeCSV } from '../utils/csv-export';
import { getRelativePath } from '../config/upload';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

// ==========================================
// Error Handler Helper
// ==========================================

function handleError(error: unknown, res: Response, next: NextFunction): void {
    // Zod validation errors
    if (error instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.errors,
        });
        return;
    }

    // Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: 'Data dengan nilai tersebut sudah ada (unique constraint violation)',
            });
            return;
        }
        if (error.code === 'P2025') {
            res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan',
            });
            return;
        }
        if (error.code === 'P2003') {
            res.status(400).json({
                success: false,
                message: 'Referensi foreign key tidak valid',
            });
            return;
        }
    }

    next(error);
}

// ==========================================
// Main CRUD Controllers
// ==========================================

/**
 * GET /api/hr/employees
 * Get all karyawan with filters, search, and pagination
 */
export async function getAllKaryawan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const params = karyawanQuerySchema.parse(req.query);
        const result = await employeeService.findAll(params);

        res.json(paginatedResponse(
            result.data,
            result.page,
            result.limit,
            result.total
        ));
    } catch (error) {
        handleError(error, res, next);
    }
}

/**
 * GET /api/hr/employees/:id
 * Get karyawan by ID with all relations
 */
export async function getKaryawanById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const karyawan = await employeeService.findById(id);

        if (!karyawan) {
            res.status(404).json({ success: false, message: 'Karyawan tidak ditemukan' });
            return;
        }

        res.json(successResponse(karyawan, 'Karyawan berhasil ditemukan'));
    } catch (error) {
        handleError(error, res, next);
    }
}

/**
 * GET /api/hr/employees/nik/:nik
 * Get karyawan by NIK
 */
export async function getKaryawanByNIK(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { nik } = req.params;
        const karyawan = await employeeService.findByNIK(nik);

        if (!karyawan) {
            res.status(404).json({ success: false, message: 'Karyawan dengan NIK tersebut tidak ditemukan' });
            return;
        }

        res.json(successResponse(karyawan, 'Karyawan berhasil ditemukan'));
    } catch (error) {
        handleError(error, res, next);
    }
}

/**
 * POST /api/hr/employees
 * Create new karyawan
 */
export async function createKaryawan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = createKaryawanSchema.parse(req.body);
        const karyawan = await employeeService.create(data);

        res.status(201).json(successResponse(karyawan, 'Karyawan berhasil dibuat'));
    } catch (error) {
        handleError(error, res, next);
    }
}

/**
 * PUT /api/hr/employees/:id
 * Update karyawan
 */
export async function updateKaryawan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;

        // Check if karyawan exists
        const existing = await employeeService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, message: 'Karyawan tidak ditemukan' });
            return;
        }

        const data = updateKaryawanSchema.parse(req.body);
        const karyawan = await employeeService.update(id, data);

        res.json(successResponse(karyawan, 'Karyawan berhasil diupdate'));
    } catch (error) {
        handleError(error, res, next);
    }
}

/**
 * DELETE /api/hr/employees/:id
 * Delete karyawan
 */
export async function deleteKaryawan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;

        // Check if karyawan exists
        const existing = await employeeService.findById(id);
        if (!existing) {
            res.status(404).json({ success: false, message: 'Karyawan tidak ditemukan' });
            return;
        }

        await employeeService.delete(id);
        res.json(successResponse(null, 'Karyawan berhasil dihapus'));
    } catch (error) {
        handleError(error, res, next);
    }
}

/**
 * POST /api/hr/employees/bulk-delete
 * Bulk delete employees
 */
export async function bulkDeleteKaryawan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ success: false, message: 'Invalid or empty IDs' });
            return;
        }

        const count = await employeeService.bulkDelete(ids);
        res.json(successResponse({ count }, `${count} karyawan berhasil dihapus`));
    } catch (error) {
        handleError(error, res, next);
    }
}

/**
 * GET /api/hr/employees/export
 * Export employees to CSV
 */
export async function exportKaryawan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const params = karyawanQuerySchema.parse(req.query);
        const employees = await employeeService.exportData(params);

        const csv = generateEmployeeCSV(employees);
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `karyawan-export-${timestamp}.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (error) {
        handleError(error, res, next);
    }
}

// ==========================================
// Child Data Controllers - Anak
// ==========================================

/**
 * POST /api/hr/employees/:id/anak
 * Add anak to karyawan
 */
export async function createAnakKaryawan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id: karyawanId } = req.params;

        // Check if karyawan exists
        const karyawan = await employeeService.findById(karyawanId);
        if (!karyawan) {
            res.status(404).json({ success: false, message: 'Karyawan tidak ditemukan' });
            return;
        }

        const data = createAnakSchema.parse(req.body);
        const anak = await employeeService.createAnak(karyawanId, data);

        res.status(201).json(successResponse(anak, 'Data anak berhasil ditambahkan'));
    } catch (error) {
        handleError(error, res, next);
    }
}

/**
 * PUT /api/hr/employees/:id/anak/:anakId
 * Update anak
 */
export async function updateAnakKaryawan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { anakId } = req.params;

        // Check if anak exists
        const existing = await employeeService.findAnakById(anakId);
        if (!existing) {
            res.status(404).json({ success: false, message: 'Data anak tidak ditemukan' });
            return;
        }

        const data = updateAnakSchema.parse(req.body);
        const anak = await employeeService.updateAnak(anakId, data);

        res.json(successResponse(anak, 'Data anak berhasil diupdate'));
    } catch (error) {
        handleError(error, res, next);
    }
}

/**
 * DELETE /api/hr/employees/:id/anak/:anakId
 * Delete anak
 */
export async function deleteAnakKaryawan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { anakId } = req.params;

        // Check if anak exists
        const existing = await employeeService.findAnakById(anakId);
        if (!existing) {
            res.status(404).json({ success: false, message: 'Data anak tidak ditemukan' });
            return;
        }

        await employeeService.deleteAnak(anakId);
        res.json(successResponse(null, 'Data anak berhasil dihapus'));
    } catch (error) {
        handleError(error, res, next);
    }
}

// ==========================================
// Child Data Controllers - Saudara Kandung
// ==========================================

/**
 * POST /api/hr/employees/:id/saudara-kandung
 * Add saudara kandung to karyawan
 */
export async function createSaudaraKandungKaryawan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id: karyawanId } = req.params;

        // Check if karyawan exists
        const karyawan = await employeeService.findById(karyawanId);
        if (!karyawan) {
            res.status(404).json({ success: false, message: 'Karyawan tidak ditemukan' });
            return;
        }

        const data = createSaudaraKandungSchema.parse(req.body);
        const saudara = await employeeService.createSaudaraKandung(karyawanId, data);

        res.status(201).json(successResponse(saudara, 'Data saudara kandung berhasil ditambahkan'));
    } catch (error) {
        if (error instanceof Error && error.message === 'Maksimal 5 saudara kandung') {
            res.status(400).json({ success: false, message: error.message });
            return;
        }
        handleError(error, res, next);
    }
}

/**
 * PUT /api/hr/employees/:id/saudara-kandung/:saudaraId
 * Update saudara kandung
 */
export async function updateSaudaraKandungKaryawan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { saudaraId } = req.params;

        // Check if saudara kandung exists
        const existing = await employeeService.findSaudaraKandungById(saudaraId);
        if (!existing) {
            res.status(404).json({ success: false, message: 'Data saudara kandung tidak ditemukan' });
            return;
        }

        const data = updateSaudaraKandungSchema.parse(req.body);
        const saudara = await employeeService.updateSaudaraKandung(saudaraId, data);

        res.json(successResponse(saudara, 'Data saudara kandung berhasil diupdate'));
    } catch (error) {
        handleError(error, res, next);
    }
}

/**
 * DELETE /api/hr/employees/:id/saudara-kandung/:saudaraId
 * Delete saudara kandung
 */
export async function deleteSaudaraKandungKaryawan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { saudaraId } = req.params;

        // Check if saudara kandung exists
        const existing = await employeeService.findSaudaraKandungById(saudaraId);
        if (!existing) {
            res.status(404).json({ success: false, message: 'Data saudara kandung tidak ditemukan' });
            return;
        }

        await employeeService.deleteSaudaraKandung(saudaraId);
        res.json(successResponse(null, 'Data saudara kandung berhasil dihapus'));
    } catch (error) {
        handleError(error, res, next);
    }
}

// ==========================================
// File Upload Controllers
// ==========================================

/**
 * POST /api/hr/employees/:id/photo
 * Upload karyawan photo
 */
export async function uploadKaryawanPhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;

        // Check if karyawan exists
        const karyawan = await employeeService.findById(id);
        if (!karyawan) {
            res.status(404).json({ success: false, message: 'Karyawan tidak ditemukan' });
            return;
        }

        // Check if file was uploaded
        if (!req.file) {
            res.status(400).json({ success: false, message: 'File foto tidak ditemukan' });
            return;
        }

        // Convert absolute path to relative path for proper static serving
        const photoPath = getRelativePath(req.file.path);
        const updatedKaryawan = await employeeService.uploadPhoto(id, photoPath);

        res.json(successResponse(updatedKaryawan, 'Foto karyawan berhasil diupload'));
    } catch (error) {
        handleError(error, res, next);
    }
}

/**
 * POST /api/hr/employees/:id/documents
 * Upload karyawan document
 */
export async function uploadKaryawanDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;

        // Check if karyawan exists
        const karyawan = await employeeService.findById(id);
        if (!karyawan) {
            res.status(404).json({ success: false, message: 'Karyawan tidak ditemukan' });
            return;
        }

        // Check if file was uploaded
        if (!req.file) {
            res.status(400).json({ success: false, message: 'File dokumen tidak ditemukan' });
            return;
        }

        const { jenisDokumen, keterangan } = req.body;
        if (!jenisDokumen) {
            res.status(400).json({ success: false, message: 'Jenis dokumen wajib diisi' });
            return;
        }

        // Convert absolute path to relative path for proper static serving
        const relativePath = getRelativePath(req.file.path);
        const dokumen = await employeeService.uploadDocument(id, {
            jenisDokumen,
            namaFile: req.file.originalname,
            pathFile: relativePath,
            ukuranFile: req.file.size,
            mimeType: req.file.mimetype,
            keterangan,
        });

        res.status(201).json(successResponse(dokumen, 'Dokumen berhasil diupload'));
    } catch (error) {
        handleError(error, res, next);
    }
}

/**
 * DELETE /api/hr/employees/:id/documents/:documentId
 * Delete karyawan document
 */
export async function deleteKaryawanDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { documentId } = req.params;

        // Check if document exists
        const existing = await employeeService.findDocumentById(documentId);
        if (!existing) {
            res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan' });
            return;
        }

        await employeeService.deleteDocument(documentId);
        res.json(successResponse(null, 'Dokumen berhasil dihapus'));
    } catch (error) {
        handleError(error, res, next);
    }
}

// ==========================================
// QR Code Controller
// ==========================================

/**
 * GET /api/hr/employees/:id/qrcode
 * Generate QR code from karyawan NIK
 */
export async function generateKaryawanQRCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const { format = 'image' } = req.query; // 'image' or 'base64'

        // Get karyawan to get NIK
        const karyawan = await employeeService.findById(id);
        if (!karyawan) {
            res.status(404).json({ success: false, message: 'Karyawan tidak ditemukan' });
            return;
        }

        if (format === 'base64') {
            const base64 = await employeeService.generateQRCodeBase64(karyawan.nomorIndukKaryawan);
            res.json(successResponse({ qrcode: base64, nik: karyawan.nomorIndukKaryawan }, 'QR Code berhasil dibuat'));
        } else {
            const buffer = await employeeService.generateQRCodeBuffer(karyawan.nomorIndukKaryawan);
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', `inline; filename="qrcode-${karyawan.nomorIndukKaryawan}.png"`);
            res.send(buffer);
        }
    } catch (error) {
        handleError(error, res, next);
    }
}
