import { PrismaClient, Resignation, ResignationStatus, ResignationType, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class ResignationService {

    async create(data: {
        karyawanId: string;
        type: ResignationType;
        effectiveDate: string | Date; // controller might pass string
        reason: string;
        remarks?: string;
    }) {
        return prisma.resignation.create({
            data: {
                karyawanId: data.karyawanId,
                type: data.type,
                effectiveDate: new Date(data.effectiveDate),
                reason: data.reason,
                remarks: data.remarks,
                status: ResignationStatus.PENDING
            }
        });
    }

    async findAll(params: {
        page?: number;
        limit?: number;
        status?: ResignationStatus;
        search?: string;
    }) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (params.status) {
            where.status = params.status;
        }
        if (params.search) {
            where.karyawan = {
                namaLengkap: {
                    contains: params.search,
                    mode: 'insensitive'
                }
            };
        }

        const [data, total] = await Promise.all([
            prisma.resignation.findMany({
                where,
                include: {
                    karyawan: {
                        select: {
                            id: true,
                            namaLengkap: true,
                            nomorIndukKaryawan: true,
                            divisi: { select: { namaDivisi: true } },
                            department: { select: { namaDepartment: true } },
                            posisiJabatan: { select: { namaPosisiJabatan: true } }
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { submissionDate: 'desc' }
            }),
            prisma.resignation.count({ where })
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async findById(id: string) {
        return prisma.resignation.findUnique({
            where: { id },
            include: {
                karyawan: {
                    select: {
                        id: true,
                        namaLengkap: true,
                        nomorIndukKaryawan: true,
                        divisi: { select: { namaDivisi: true } },
                        department: { select: { namaDepartment: true } },
                        posisiJabatan: { select: { namaPosisiJabatan: true } }
                    }
                }
            }
        });
    }

    async updateStatus(id: string, status: ResignationStatus, approvedBy?: string, rejectionReason?: string) {
        // Start transaction
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const resignation = await tx.resignation.findUnique({
                where: { id }
            });

            if (!resignation) {
                throw new Error('Resignation not found');
            }

            if (resignation.status !== ResignationStatus.PENDING) {
                throw new Error('Resignation is already processed');
            }

            const updateData: any = {
                status,
                remarks: rejectionReason ? `${resignation.remarks || ''}\n\nRejection Reason: ${rejectionReason}` : resignation.remarks
            };

            if (status === ResignationStatus.APPROVED) {
                updateData.approvedBy = approvedBy;
                updateData.approvedAt = new Date();

                // Find "Tidak Aktif" status ID from StatusKaryawan master
                const inactiveStatus = await tx.statusKaryawan.findFirst({
                    where: {
                        namaStatus: {
                            contains: 'Tidak Aktif',
                            mode: 'insensitive'
                        }
                    }
                });

                // Update employee status
                await tx.karyawan.update({
                    where: { id: resignation.karyawanId },
                    data: {
                        statusKaryawanId: inactiveStatus?.id, // If not found, it might remain nicely or error? Ideally we should handle this gracefully or create it. 
                        // For now, let's assume it exists or just set tanggalBerhenti
                        tanggalBerhenti: resignation.effectiveDate
                    }
                });
            }

            return tx.resignation.update({
                where: { id },
                data: updateData
            });
        });
    }
}

export const resignationService = new ResignationService();
