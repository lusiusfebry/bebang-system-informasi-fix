/**
 * Employee Service
 * Business logic dan database operations untuk Employee management
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { generateQRCodeBuffer, generateQRCodeBase64 } from '../utils/qrcode';
import { deleteFile } from '../config/upload';
import type {
    CreateKaryawanInput,
    UpdateKaryawanInput,
    CreateAnakInput,
    UpdateAnakInput,
    CreateSaudaraKandungInput,
    UpdateSaudaraKandungInput,
    KaryawanQueryInput,
} from '../validators/employee.validator';

// ==========================================
// Type Definitions
// ==========================================

interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Include relations for detail view
const karyawanDetailInclude = {
    divisi: true,
    department: true,
    posisiJabatan: true,
    statusKaryawan: true,
    lokasiKerja: true,
    tag: true,
    jenisHubunganKerja: true,
    kategoriPangkat: true,
    golonganPangkat: true,
    subGolonganPangkat: true,
    lokasiSebelumnya: true,
    manager: { select: { id: true, namaLengkap: true, nomorIndukKaryawan: true } },
    atasanLangsung: { select: { id: true, namaLengkap: true, nomorIndukKaryawan: true } },
    anak: { orderBy: { urutanAnak: 'asc' as const } },
    saudaraKandung: { orderBy: { urutanSaudara: 'asc' as const } },
    dokumen: { orderBy: { createdAt: 'desc' as const } },
};

// Include relations for list view (lighter)
const karyawanListInclude = {
    divisi: { select: { id: true, namaDivisi: true } },
    department: { select: { id: true, namaDepartment: true } },
    posisiJabatan: { select: { id: true, namaPosisiJabatan: true } },
    statusKaryawan: { select: { id: true, namaStatus: true } },
    lokasiKerja: { select: { id: true, namaLokasiKerja: true } },
    tag: { select: { id: true, namaTag: true, warnaTag: true } },
};

// ==========================================
// Employee Service
// ==========================================

export const employeeService = {
    /**
     * Find all karyawan with filters, search, and pagination
     */
    findAll: async (params: KaryawanQueryInput): Promise<PaginatedResult<unknown>> => {
        const {
            search,
            divisiId,
            departmentId,
            statusKaryawanId,
            lokasiKerjaId,
            tagId,
            jenisHubunganKerjaId,
            page = 1,
            limit = 10,
            sortBy = 'namaLengkap',
            sortOrder = 'asc',
        } = params;

        // Build where clause
        const where: Prisma.KaryawanWhereInput = {
            // Filters
            ...(divisiId && { divisiId }),
            ...(departmentId && { departmentId }),
            ...(statusKaryawanId && { statusKaryawanId }),
            ...(lokasiKerjaId && { lokasiKerjaId }),
            ...(tagId && { tagId }),
            ...(jenisHubunganKerjaId && { jenisHubunganKerjaId }),
            // Search across multiple fields
            ...(search && {
                OR: [
                    { namaLengkap: { contains: search, mode: 'insensitive' } },
                    { nomorIndukKaryawan: { contains: search, mode: 'insensitive' } },
                    { emailPerusahaan: { contains: search, mode: 'insensitive' } },
                    { emailPribadi: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.karyawan.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: karyawanListInclude,
            }),
            prisma.karyawan.count({ where }),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    },

    /**
     * Find karyawan by ID with all relations
     */
    findById: async (id: string) => {
        return prisma.karyawan.findUnique({
            where: { id },
            include: karyawanDetailInclude,
        });
    },

    /**
     * Find karyawan by NIK
     */
    findByNIK: async (nik: string) => {
        return prisma.karyawan.findUnique({
            where: { nomorIndukKaryawan: nik },
            include: karyawanDetailInclude,
        });
    },

    /**
     * Create new karyawan
     */
    create: async (data: CreateKaryawanInput) => {
        return prisma.karyawan.create({
            data: data as Prisma.KaryawanCreateInput,
            include: karyawanDetailInclude,
        });
    },

    /**
     * Update karyawan
     */
    update: async (id: string, data: UpdateKaryawanInput) => {
        return prisma.karyawan.update({
            where: { id },
            data: data as Prisma.KaryawanUpdateInput,
            include: karyawanDetailInclude,
        });
    },

    /**
     * Delete karyawan (hard delete with cascade)
     */
    delete: async (id: string) => {
        // Anak, SaudaraKandung, DokumenKaryawan will cascade delete due to schema
        return prisma.karyawan.delete({
            where: { id },
        });
    },

    /**
     * Bulk delete karyawan
     */
    bulkDelete: async (ids: string[]) => {
        const result = await prisma.karyawan.deleteMany({
            where: {
                id: { in: ids },
            },
        });
        return result.count;
    },

    /**
     * Export data karyawan (no pagination)
     */
    exportData: async (params: KaryawanQueryInput) => {
        const {
            search,
            divisiId,
            departmentId,
            statusKaryawanId,
            lokasiKerjaId,
            tagId,
            jenisHubunganKerjaId,
            sortBy = 'namaLengkap',
            sortOrder = 'asc',
        } = params;

        const where: Prisma.KaryawanWhereInput = {
            ...(divisiId && { divisiId }),
            ...(departmentId && { departmentId }),
            ...(statusKaryawanId && { statusKaryawanId }),
            ...(lokasiKerjaId && { lokasiKerjaId }),
            ...(tagId && { tagId }),
            ...(jenisHubunganKerjaId && { jenisHubunganKerjaId }),
            ...(search && {
                OR: [
                    { namaLengkap: { contains: search, mode: 'insensitive' } },
                    { nomorIndukKaryawan: { contains: search, mode: 'insensitive' } },
                    { emailPerusahaan: { contains: search, mode: 'insensitive' } },
                    { emailPribadi: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        return prisma.karyawan.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            include: karyawanListInclude,
        });
    },

    // ==========================================
    // Child Data Methods - Anak
    // ==========================================

    createAnak: async (karyawanId: string, data: CreateAnakInput) => {
        return prisma.anak.create({
            data: {
                ...data,
                karyawanId,
            },
        });
    },

    updateAnak: async (id: string, data: UpdateAnakInput) => {
        return prisma.anak.update({
            where: { id },
            data,
        });
    },

    deleteAnak: async (id: string) => {
        return prisma.anak.delete({
            where: { id },
        });
    },

    findAnakById: async (id: string) => {
        return prisma.anak.findUnique({
            where: { id },
        });
    },

    // ==========================================
    // Child Data Methods - Saudara Kandung
    // ==========================================

    createSaudaraKandung: async (karyawanId: string, data: CreateSaudaraKandungInput) => {
        // Check max 5 saudara kandung
        const count = await prisma.saudaraKandung.count({ where: { karyawanId } });
        if (count >= 5) {
            throw new Error('Maksimal 5 saudara kandung');
        }

        return prisma.saudaraKandung.create({
            data: {
                ...data,
                karyawanId,
            },
        });
    },

    updateSaudaraKandung: async (id: string, data: UpdateSaudaraKandungInput) => {
        return prisma.saudaraKandung.update({
            where: { id },
            data,
        });
    },

    deleteSaudaraKandung: async (id: string) => {
        return prisma.saudaraKandung.delete({
            where: { id },
        });
    },

    findSaudaraKandungById: async (id: string) => {
        return prisma.saudaraKandung.findUnique({
            where: { id },
        });
    },

    // ==========================================
    // File Management Methods
    // ==========================================

    /**
     * Upload and update employee photo
     */
    uploadPhoto: async (karyawanId: string, photoPath: string) => {
        // Get current photo to delete old one
        const karyawan = await prisma.karyawan.findUnique({
            where: { id: karyawanId },
            select: { fotoKaryawan: true },
        });

        // Delete old photo if exists
        if (karyawan?.fotoKaryawan) {
            try {
                deleteFile(karyawan.fotoKaryawan);
            } catch {
                // Ignore if file doesn't exist
            }
        }

        // Update with new photo path
        return prisma.karyawan.update({
            where: { id: karyawanId },
            data: { fotoKaryawan: photoPath },
            include: karyawanDetailInclude,
        });
    },

    /**
     * Upload document and create record
     */
    uploadDocument: async (
        karyawanId: string,
        documentData: {
            jenisDokumen: string;
            namaFile: string;
            pathFile: string;
            ukuranFile: number;
            mimeType: string;
            keterangan?: string;
        }
    ) => {
        return prisma.dokumenKaryawan.create({
            data: {
                ...documentData,
                karyawanId,
            },
        });
    },

    /**
     * Delete document from database and filesystem
     */
    deleteDocument: async (id: string) => {
        const dokumen = await prisma.dokumenKaryawan.findUnique({
            where: { id },
        });

        if (dokumen) {
            try {
                deleteFile(dokumen.pathFile);
            } catch {
                // Ignore if file doesn't exist
            }
        }

        return prisma.dokumenKaryawan.delete({
            where: { id },
        });
    },

    findDocumentById: async (id: string) => {
        return prisma.dokumenKaryawan.findUnique({
            where: { id },
        });
    },

    // ==========================================
    // QR Code Methods
    // ==========================================

    /**
     * Generate QR code as buffer (for image response)
     */
    generateQRCodeBuffer: async (nik: string): Promise<Buffer> => {
        return generateQRCodeBuffer(nik);
    },

    /**
     * Generate QR code as base64 (for JSON response)
     */
    generateQRCodeBase64: async (nik: string): Promise<string> => {
        return generateQRCodeBase64(nik);
    },
};
