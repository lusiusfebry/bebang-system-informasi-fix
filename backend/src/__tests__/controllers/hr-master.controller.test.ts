/**
 * HR Master Controller Unit Tests
 * Tests untuk semua controller functions dengan mocking services
 */

import { Request, Response, NextFunction } from 'express';

// Mock services before importing controller
jest.mock('../../services/hr-master.service', () => ({
    divisiService: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    },
    departmentService: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    },
    posisiJabatanService: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    },
    kategoriPangkatService: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    },
    golonganService: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    },
    subGolonganService: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    },
    jenisHubunganKerjaService: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    },
    tagService: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    },
    lokasiKerjaService: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    },
    statusKaryawanService: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    },
}));

import * as hrMasterController from '../../controllers/hr-master.controller';
import { divisiService, departmentService, tagService } from '../../services/hr-master.service';

// Mock response helper
const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

const mockNext: NextFunction = jest.fn();

// Sample data
const mockDivisi = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    namaDivisi: 'Divisi IT',
    keterangan: 'Mengelola teknologi informasi',
    status: 'AKTIF' as const,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};

// ==========================================
// DIVISI CONTROLLER TESTS
// ==========================================

describe('Divisi Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllDivisi', () => {
        it('should return paginated list of divisi', async () => {
            const req = {
                query: { status: 'AKTIF', page: '1', limit: '10' },
            } as unknown as Request;
            const res = mockResponse();

            (divisiService.findAll as jest.Mock).mockResolvedValue({
                data: [mockDivisi],
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1,
            });

            await hrMasterController.getAllDivisi(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.any(Array),
                    meta: expect.objectContaining({
                        page: 1,
                        limit: 10,
                        total: 1,
                    }),
                })
            );
        });

        it('should filter by status AKTIF', async () => {
            const req = {
                query: { status: 'AKTIF', page: '1', limit: '10' },
            } as unknown as Request;
            const res = mockResponse();

            (divisiService.findAll as jest.Mock).mockResolvedValue({
                data: [mockDivisi],
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1,
            });

            await hrMasterController.getAllDivisi(req, res, mockNext);

            expect(divisiService.findAll).toHaveBeenCalledWith(
                expect.objectContaining({ status: 'AKTIF' }),
                expect.any(Object)
            );
        });

        it('should return empty array when no data', async () => {
            const req = {
                query: { page: '1', limit: '10' },
            } as unknown as Request;
            const res = mockResponse();

            (divisiService.findAll as jest.Mock).mockResolvedValue({
                data: [],
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
            });

            await hrMasterController.getAllDivisi(req, res, mockNext);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: [],
                    meta: expect.objectContaining({
                        total: 0,
                    }),
                })
            );
        });
    });

    describe('getDivisiById', () => {
        it('should return divisi by id', async () => {
            const req = {
                params: { id: mockDivisi.id },
            } as unknown as Request;
            const res = mockResponse();

            (divisiService.findById as jest.Mock).mockResolvedValue(mockDivisi);

            await hrMasterController.getDivisiById(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: mockDivisi,
                })
            );
        });

        it('should return 404 when divisi not found', async () => {
            const req = {
                params: { id: 'non-existent-id' },
            } as unknown as Request;
            const res = mockResponse();

            (divisiService.findById as jest.Mock).mockResolvedValue(null);

            await hrMasterController.getDivisiById(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: expect.objectContaining({
                        message: expect.stringContaining('tidak ditemukan'),
                    }),
                })
            );
        });
    });

    describe('createDivisi', () => {
        it('should create new divisi', async () => {
            const req = {
                body: {
                    namaDivisi: 'Divisi Baru',
                    keterangan: 'Test divisi',
                },
            } as unknown as Request;
            const res = mockResponse();

            const newDivisi = { ...mockDivisi, namaDivisi: 'Divisi Baru' };
            (divisiService.create as jest.Mock).mockResolvedValue(newDivisi);

            await hrMasterController.createDivisi(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        namaDivisi: 'Divisi Baru',
                    }),
                })
            );
        });
    });

    describe('updateDivisi', () => {
        it('should update divisi', async () => {
            const req = {
                params: { id: mockDivisi.id },
                body: { namaDivisi: 'Updated Divisi' },
            } as unknown as Request;
            const res = mockResponse();

            (divisiService.findById as jest.Mock).mockResolvedValue(mockDivisi);
            (divisiService.update as jest.Mock).mockResolvedValue({ ...mockDivisi, namaDivisi: 'Updated Divisi' });

            await hrMasterController.updateDivisi(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        namaDivisi: 'Updated Divisi',
                    }),
                })
            );
        });

        it('should return 404 when divisi not found', async () => {
            const req = {
                params: { id: 'non-existent-id' },
                body: { namaDivisi: 'Updated' },
            } as unknown as Request;
            const res = mockResponse();

            (divisiService.findById as jest.Mock).mockResolvedValue(null);

            await hrMasterController.updateDivisi(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteDivisi', () => {
        it('should soft delete divisi (set status TIDAK_AKTIF)', async () => {
            const req = {
                params: { id: mockDivisi.id },
            } as unknown as Request;
            const res = mockResponse();

            (divisiService.findById as jest.Mock).mockResolvedValue(mockDivisi);
            (divisiService.softDelete as jest.Mock).mockResolvedValue({ ...mockDivisi, status: 'TIDAK_AKTIF' as const });

            await hrMasterController.deleteDivisi(req, res, mockNext);

            expect(divisiService.softDelete).toHaveBeenCalledWith(mockDivisi.id);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when divisi not found', async () => {
            const req = {
                params: { id: 'non-existent-id' },
            } as unknown as Request;
            const res = mockResponse();

            (divisiService.findById as jest.Mock).mockResolvedValue(null);

            await hrMasterController.deleteDivisi(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});

// ==========================================
// DEPARTMENT CONTROLLER TESTS
// ==========================================

describe('Department Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockDepartment = {
        id: '550e8400-e29b-41d4-a716-446655440010',
        namaDepartment: 'IT Support',
        divisiId: mockDivisi.id,
        managerId: null,
        keterangan: 'IT Support team',
        status: 'AKTIF' as const,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    describe('getAllDepartment', () => {
        it('should return paginated list of department', async () => {
            const req = {
                query: { page: '1', limit: '10' },
            } as unknown as Request;
            const res = mockResponse();

            (departmentService.findAll as jest.Mock).mockResolvedValue({
                data: [mockDepartment],
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1,
            });

            await hrMasterController.getAllDepartment(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.any(Array),
                })
            );
        });
    });

    describe('getDepartmentById', () => {
        it('should return 404 when department not found', async () => {
            const req = {
                params: { id: 'non-existent-id' },
            } as unknown as Request;
            const res = mockResponse();

            (departmentService.findById as jest.Mock).mockResolvedValue(null);

            await hrMasterController.getDepartmentById(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});

// ==========================================
// TAG CONTROLLER TESTS
// ==========================================

describe('Tag Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockTag = {
        id: '550e8400-e29b-41d4-a716-446655440030',
        namaTag: 'Urgent',
        warnaTag: '#FF0000',
        keterangan: 'Tag untuk item urgent',
        status: 'AKTIF' as const,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    describe('getAllTag', () => {
        it('should return paginated list of tags', async () => {
            const req = {
                query: { page: '1', limit: '10' },
            } as unknown as Request;
            const res = mockResponse();

            (tagService.findAll as jest.Mock).mockResolvedValue({
                data: [mockTag],
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1,
            });

            await hrMasterController.getAllTag(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('createTag', () => {
        it('should create new tag with hex color', async () => {
            const req = {
                body: {
                    namaTag: 'New Tag',
                    warnaTag: '#00FF00',
                },
            } as unknown as Request;
            const res = mockResponse();

            (tagService.create as jest.Mock).mockResolvedValue({
                ...mockTag,
                namaTag: 'New Tag',
                warnaTag: '#00FF00',
            });

            await hrMasterController.createTag(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        warnaTag: '#00FF00',
                    }),
                })
            );
        });
    });
});
