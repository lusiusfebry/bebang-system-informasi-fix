/**
 * HR Master Data Service
 * Reusable helper functions untuk operasi database master data HR
 */

import { Prisma, StatusMaster } from '@prisma/client';
import { prisma } from '../lib/prisma';

// ==========================================
// Type Definitions
// ==========================================

interface FilterOptions {
    status?: 'AKTIF' | 'TIDAK_AKTIF';
    search?: string;
}

interface PaginationOptions {
    page: number;
    limit: number;
}

interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ==========================================
// Divisi Service
// ==========================================

export const divisiService = {
    findAll: async (filters: FilterOptions, pagination: PaginationOptions): Promise<PaginatedResult<Prisma.DivisiGetPayload<object>>> => {
        const { status, search } = filters;
        const { page, limit } = pagination;

        const where: Prisma.DivisiWhereInput = {
            ...(status && { status: status as StatusMaster }),
            ...(search && {
                OR: [
                    { namaDivisi: { contains: search, mode: 'insensitive' } },
                    { keterangan: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.divisi.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.divisi.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    findById: (id: string) => prisma.divisi.findUnique({ where: { id } }),
    create: (data: Prisma.DivisiCreateInput) => prisma.divisi.create({ data }),
    update: (id: string, data: Prisma.DivisiUpdateInput) => prisma.divisi.update({ where: { id }, data }),
    softDelete: (id: string) => prisma.divisi.update({ where: { id }, data: { status: 'TIDAK_AKTIF' } }),
};

// ==========================================
// Department Service
// ==========================================

export const departmentService = {
    findAll: async (filters: FilterOptions, pagination: PaginationOptions) => {
        const { status, search } = filters;
        const { page, limit } = pagination;

        const where: Prisma.DepartmentWhereInput = {
            ...(status && { status: status as StatusMaster }),
            ...(search && {
                OR: [
                    { namaDepartment: { contains: search, mode: 'insensitive' } },
                    { keterangan: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.department.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { divisi: true, manager: true },
            }),
            prisma.department.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    findById: (id: string) => prisma.department.findUnique({
        where: { id },
        include: { divisi: true, manager: true },
    }),
    create: (data: Prisma.DepartmentCreateInput) => prisma.department.create({
        data,
        include: { divisi: true },
    }),
    update: (id: string, data: Prisma.DepartmentUpdateInput) => prisma.department.update({
        where: { id },
        data,
        include: { divisi: true },
    }),
    softDelete: (id: string) => prisma.department.update({ where: { id }, data: { status: 'TIDAK_AKTIF' } }),
};

// ==========================================
// Posisi Jabatan Service
// ==========================================

export const posisiJabatanService = {
    findAll: async (filters: FilterOptions, pagination: PaginationOptions) => {
        const { status, search } = filters;
        const { page, limit } = pagination;

        const where: Prisma.PosisiJabatanWhereInput = {
            ...(status && { status: status as StatusMaster }),
            ...(search && {
                OR: [
                    { namaPosisiJabatan: { contains: search, mode: 'insensitive' } },
                    { keterangan: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.posisiJabatan.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { department: true },
            }),
            prisma.posisiJabatan.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    findById: (id: string) => prisma.posisiJabatan.findUnique({
        where: { id },
        include: { department: true },
    }),
    create: (data: Prisma.PosisiJabatanCreateInput) => prisma.posisiJabatan.create({
        data,
        include: { department: true },
    }),
    update: (id: string, data: Prisma.PosisiJabatanUpdateInput) => prisma.posisiJabatan.update({
        where: { id },
        data,
        include: { department: true },
    }),
    softDelete: (id: string) => prisma.posisiJabatan.update({ where: { id }, data: { status: 'TIDAK_AKTIF' } }),
};

// ==========================================
// Kategori Pangkat Service
// ==========================================

export const kategoriPangkatService = {
    findAll: async (filters: FilterOptions, pagination: PaginationOptions) => {
        const { status, search } = filters;
        const { page, limit } = pagination;

        const where: Prisma.KategoriPangkatWhereInput = {
            ...(status && { status: status as StatusMaster }),
            ...(search && {
                OR: [
                    { namaKategoriPangkat: { contains: search, mode: 'insensitive' } },
                    { keterangan: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.kategoriPangkat.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.kategoriPangkat.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    findById: (id: string) => prisma.kategoriPangkat.findUnique({ where: { id } }),
    create: (data: Prisma.KategoriPangkatCreateInput) => prisma.kategoriPangkat.create({ data }),
    update: (id: string, data: Prisma.KategoriPangkatUpdateInput) => prisma.kategoriPangkat.update({ where: { id }, data }),
    softDelete: (id: string) => prisma.kategoriPangkat.update({ where: { id }, data: { status: 'TIDAK_AKTIF' } }),
};

// ==========================================
// Golongan Service
// ==========================================

export const golonganService = {
    findAll: async (filters: FilterOptions, pagination: PaginationOptions) => {
        const { status, search } = filters;
        const { page, limit } = pagination;

        const where: Prisma.GolonganWhereInput = {
            ...(status && { status: status as StatusMaster }),
            ...(search && {
                OR: [
                    { namaGolongan: { contains: search, mode: 'insensitive' } },
                    { keterangan: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.golongan.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.golongan.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    findById: (id: string) => prisma.golongan.findUnique({ where: { id } }),
    create: (data: Prisma.GolonganCreateInput) => prisma.golongan.create({ data }),
    update: (id: string, data: Prisma.GolonganUpdateInput) => prisma.golongan.update({ where: { id }, data }),
    softDelete: (id: string) => prisma.golongan.update({ where: { id }, data: { status: 'TIDAK_AKTIF' } }),
};

// ==========================================
// Sub Golongan Service
// ==========================================

export const subGolonganService = {
    findAll: async (filters: FilterOptions, pagination: PaginationOptions) => {
        const { status, search } = filters;
        const { page, limit } = pagination;

        const where: Prisma.SubGolonganWhereInput = {
            ...(status && { status: status as StatusMaster }),
            ...(search && {
                OR: [
                    { namaSubGolongan: { contains: search, mode: 'insensitive' } },
                    { keterangan: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.subGolongan.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.subGolongan.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    findById: (id: string) => prisma.subGolongan.findUnique({ where: { id } }),
    create: (data: Prisma.SubGolonganCreateInput) => prisma.subGolongan.create({ data }),
    update: (id: string, data: Prisma.SubGolonganUpdateInput) => prisma.subGolongan.update({ where: { id }, data }),
    softDelete: (id: string) => prisma.subGolongan.update({ where: { id }, data: { status: 'TIDAK_AKTIF' } }),
};

// ==========================================
// Jenis Hubungan Kerja Service
// ==========================================

export const jenisHubunganKerjaService = {
    findAll: async (filters: FilterOptions, pagination: PaginationOptions) => {
        const { status, search } = filters;
        const { page, limit } = pagination;

        const where: Prisma.JenisHubunganKerjaWhereInput = {
            ...(status && { status: status as StatusMaster }),
            ...(search && {
                OR: [
                    { namaJenisHubunganKerja: { contains: search, mode: 'insensitive' } },
                    { keterangan: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.jenisHubunganKerja.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.jenisHubunganKerja.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    findById: (id: string) => prisma.jenisHubunganKerja.findUnique({ where: { id } }),
    create: (data: Prisma.JenisHubunganKerjaCreateInput) => prisma.jenisHubunganKerja.create({ data }),
    update: (id: string, data: Prisma.JenisHubunganKerjaUpdateInput) => prisma.jenisHubunganKerja.update({ where: { id }, data }),
    softDelete: (id: string) => prisma.jenisHubunganKerja.update({ where: { id }, data: { status: 'TIDAK_AKTIF' } }),
};

// ==========================================
// Tag Service
// ==========================================

export const tagService = {
    findAll: async (filters: FilterOptions, pagination: PaginationOptions) => {
        const { status, search } = filters;
        const { page, limit } = pagination;

        const where: Prisma.TagWhereInput = {
            ...(status && { status: status as StatusMaster }),
            ...(search && {
                OR: [
                    { namaTag: { contains: search, mode: 'insensitive' } },
                    { keterangan: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.tag.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.tag.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    findById: (id: string) => prisma.tag.findUnique({ where: { id } }),
    create: (data: Prisma.TagCreateInput) => prisma.tag.create({ data }),
    update: (id: string, data: Prisma.TagUpdateInput) => prisma.tag.update({ where: { id }, data }),
    softDelete: (id: string) => prisma.tag.update({ where: { id }, data: { status: 'TIDAK_AKTIF' } }),
};

// ==========================================
// Lokasi Kerja Service
// ==========================================

export const lokasiKerjaService = {
    findAll: async (filters: FilterOptions, pagination: PaginationOptions) => {
        const { status, search } = filters;
        const { page, limit } = pagination;

        const where: Prisma.LokasiKerjaWhereInput = {
            ...(status && { status: status as StatusMaster }),
            ...(search && {
                OR: [
                    { namaLokasiKerja: { contains: search, mode: 'insensitive' } },
                    { alamat: { contains: search, mode: 'insensitive' } },
                    { keterangan: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.lokasiKerja.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.lokasiKerja.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    findById: (id: string) => prisma.lokasiKerja.findUnique({ where: { id } }),
    create: (data: Prisma.LokasiKerjaCreateInput) => prisma.lokasiKerja.create({ data }),
    update: (id: string, data: Prisma.LokasiKerjaUpdateInput) => prisma.lokasiKerja.update({ where: { id }, data }),
    softDelete: (id: string) => prisma.lokasiKerja.update({ where: { id }, data: { status: 'TIDAK_AKTIF' } }),
};

// ==========================================
// Status Karyawan Service
// ==========================================

export const statusKaryawanService = {
    findAll: async (filters: FilterOptions, pagination: PaginationOptions) => {
        const { status, search } = filters;
        const { page, limit } = pagination;

        const where: Prisma.StatusKaryawanWhereInput = {
            ...(status && { status: status as StatusMaster }),
            ...(search && {
                OR: [
                    { namaStatus: { contains: search, mode: 'insensitive' } },
                    { keterangan: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            prisma.statusKaryawan.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.statusKaryawan.count({ where }),
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    findById: (id: string) => prisma.statusKaryawan.findUnique({ where: { id } }),
    create: (data: Prisma.StatusKaryawanCreateInput) => prisma.statusKaryawan.create({ data }),
    update: (id: string, data: Prisma.StatusKaryawanUpdateInput) => prisma.statusKaryawan.update({ where: { id }, data }),
    softDelete: (id: string) => prisma.statusKaryawan.update({ where: { id }, data: { status: 'TIDAK_AKTIF' } }),
};

export { prisma };
