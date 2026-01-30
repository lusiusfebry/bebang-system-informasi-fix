/**
 * Employee Controller Unit Tests
 * Tests untuk Employee Management Controller dengan mocking services
 */

import { Request, Response, NextFunction } from 'express';

// Mock services before importing controller
jest.mock('../../services/employee.service', () => ({
    employeeService: {
        findAll: jest.fn(),
        findById: jest.fn(),
        findByNIK: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        createAnak: jest.fn(),
        updateAnak: jest.fn(),
        deleteAnak: jest.fn(),
        findAnakById: jest.fn(),
        createSaudaraKandung: jest.fn(),
        updateSaudaraKandung: jest.fn(),
        deleteSaudaraKandung: jest.fn(),
        findSaudaraKandungById: jest.fn(),
        uploadPhoto: jest.fn(),
        uploadDocument: jest.fn(),
        deleteDocument: jest.fn(),
        findDocumentById: jest.fn(),
        generateQRCodeBuffer: jest.fn(),
        generateQRCodeBase64: jest.fn(),
    },
}));

import * as employeeController from '../../controllers/employee.controller';
import { employeeService } from '../../services/employee.service';

// Mock response helper
const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
};

const mockNext: NextFunction = jest.fn();

// Sample data
const mockKaryawan = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    namaLengkap: 'Budi Santoso',
    nomorIndukKaryawan: 'EMP001',
    nomorHandphone: '081234567890',
    fotoKaryawan: null,
    jenisKelamin: 'LAKI_LAKI',
    divisiId: '550e8400-e29b-41d4-a716-446655440010',
    departmentId: '550e8400-e29b-41d4-a716-446655440011',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    divisi: { id: '550e8400-e29b-41d4-a716-446655440010', namaDivisi: 'HR' },
    department: { id: '550e8400-e29b-41d4-a716-446655440011', namaDepartment: 'HR Department' },
};

const mockAnak = {
    id: '550e8400-e29b-41d4-a716-446655440020',
    karyawanId: mockKaryawan.id,
    urutanAnak: 1,
    namaAnak: 'Anak Pertama',
    jenisKelamin: 'LAKI_LAKI',
    tanggalLahir: new Date('2015-05-20'),
    keterangan: null,
};

const mockSaudara = {
    id: '550e8400-e29b-41d4-a716-446655440030',
    karyawanId: mockKaryawan.id,
    urutanSaudara: 1,
    namaSaudaraKandung: 'Saudara Pertama',
    jenisKelamin: 'PEREMPUAN',
    tanggalLahir: null,
    pekerjaan: null,
};

// ==========================================
// KARYAWAN CRUD TESTS
// ==========================================

describe('Employee Controller - CRUD', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllKaryawan', () => {
        it('should return paginated list of karyawan', async () => {
            const req = {
                query: { page: '1', limit: '10' },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findAll as jest.Mock).mockResolvedValue({
                data: [mockKaryawan],
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1,
            });

            await employeeController.getAllKaryawan(req, res, mockNext);

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

        it('should filter by search term', async () => {
            const req = {
                query: { search: 'Budi', page: '1', limit: '10' },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findAll as jest.Mock).mockResolvedValue({
                data: [mockKaryawan],
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1,
            });

            await employeeController.getAllKaryawan(req, res, mockNext);

            expect(employeeService.findAll).toHaveBeenCalledWith(
                expect.objectContaining({ search: 'Budi' })
            );
        });

        it('should filter by divisiId', async () => {
            const req = {
                query: { divisiId: '550e8400-e29b-41d4-a716-446655440010', page: '1', limit: '10' },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findAll as jest.Mock).mockResolvedValue({
                data: [mockKaryawan],
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1,
            });

            await employeeController.getAllKaryawan(req, res, mockNext);

            expect(employeeService.findAll).toHaveBeenCalledWith(
                expect.objectContaining({ divisiId: '550e8400-e29b-41d4-a716-446655440010' })
            );
        });
    });

    describe('getKaryawanById', () => {
        it('should return karyawan by id', async () => {
            const req = {
                params: { id: mockKaryawan.id },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);

            await employeeController.getKaryawanById(req, res, mockNext);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: mockKaryawan,
                })
            );
        });

        it('should return 404 when karyawan not found', async () => {
            const req = {
                params: { id: 'non-existent-id' },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(null);

            await employeeController.getKaryawanById(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Karyawan tidak ditemukan',
                })
            );
        });
    });

    describe('getKaryawanByNIK', () => {
        it('should return karyawan by NIK', async () => {
            const req = {
                params: { nik: 'EMP001' },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findByNIK as jest.Mock).mockResolvedValue(mockKaryawan);

            await employeeController.getKaryawanByNIK(req, res, mockNext);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: mockKaryawan,
                })
            );
        });

        it('should return 404 when NIK not found', async () => {
            const req = {
                params: { nik: 'INVALID' },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findByNIK as jest.Mock).mockResolvedValue(null);

            await employeeController.getKaryawanByNIK(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('createKaryawan', () => {
        it('should create new karyawan', async () => {
            const req = {
                body: {
                    namaLengkap: 'Karyawan Baru',
                    nomorIndukKaryawan: 'EMP002',
                    nomorHandphone: '081234567891',
                },
            } as unknown as Request;
            const res = mockResponse();

            const newKaryawan = { ...mockKaryawan, namaLengkap: 'Karyawan Baru', nomorIndukKaryawan: 'EMP002' };
            (employeeService.create as jest.Mock).mockResolvedValue(newKaryawan);

            await employeeController.createKaryawan(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        nomorIndukKaryawan: 'EMP002',
                    }),
                })
            );
        });
    });

    describe('updateKaryawan', () => {
        it('should update karyawan', async () => {
            const req = {
                params: { id: mockKaryawan.id },
                body: { namaLengkap: 'Updated Name' },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.update as jest.Mock).mockResolvedValue({ ...mockKaryawan, namaLengkap: 'Updated Name' });

            await employeeController.updateKaryawan(req, res, mockNext);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        namaLengkap: 'Updated Name',
                    }),
                })
            );
        });

        it('should return 404 if karyawan not found', async () => {
            const req = {
                params: { id: 'non-existent-id' },
                body: { namaLengkap: 'Updated' },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(null);

            await employeeController.updateKaryawan(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteKaryawan', () => {
        it('should delete karyawan', async () => {
            const req = {
                params: { id: mockKaryawan.id },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.delete as jest.Mock).mockResolvedValue(mockKaryawan);

            await employeeController.deleteKaryawan(req, res, mockNext);

            expect(employeeService.delete).toHaveBeenCalledWith(mockKaryawan.id);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                })
            );
        });

        it('should return 404 if karyawan not found', async () => {
            const req = {
                params: { id: 'non-existent-id' },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(null);

            await employeeController.deleteKaryawan(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});

// ==========================================
// ANAK TESTS
// ==========================================

describe('Employee Controller - Anak', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createAnakKaryawan', () => {
        it('should add anak to karyawan', async () => {
            const req = {
                params: { id: mockKaryawan.id },
                body: {
                    urutanAnak: 1,
                    namaAnak: 'Anak Baru',
                    jenisKelamin: 'LAKI_LAKI',
                    tanggalLahir: '2015-05-20',
                },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.createAnak as jest.Mock).mockResolvedValue(mockAnak);

            await employeeController.createAnakKaryawan(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                })
            );
        });

        it('should return 404 if karyawan not found', async () => {
            const req = {
                params: { id: 'non-existent-id' },
                body: {
                    urutanAnak: 1,
                    namaAnak: 'Anak Baru',
                    jenisKelamin: 'LAKI_LAKI',
                    tanggalLahir: '2015-05-20',
                },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(null);

            await employeeController.createAnakKaryawan(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteAnakKaryawan', () => {
        it('should delete anak', async () => {
            const req = {
                params: { id: mockKaryawan.id, anakId: mockAnak.id },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findAnakById as jest.Mock).mockResolvedValue(mockAnak);
            (employeeService.deleteAnak as jest.Mock).mockResolvedValue(mockAnak);

            await employeeController.deleteAnakKaryawan(req, res, mockNext);

            expect(employeeService.deleteAnak).toHaveBeenCalledWith(mockAnak.id);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                })
            );
        });
    });
});

// ==========================================
// SAUDARA KANDUNG TESTS
// ==========================================

describe('Employee Controller - Saudara Kandung', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createSaudaraKandungKaryawan', () => {
        it('should add saudara kandung to karyawan', async () => {
            const req = {
                params: { id: mockKaryawan.id },
                body: {
                    urutanSaudara: 1,
                    namaSaudaraKandung: 'Saudara Baru',
                    jenisKelamin: 'PEREMPUAN',
                },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.createSaudaraKandung as jest.Mock).mockResolvedValue(mockSaudara);

            await employeeController.createSaudaraKandungKaryawan(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 400 when max saudara exceeded', async () => {
            const req = {
                params: { id: mockKaryawan.id },
                body: {
                    urutanSaudara: 5,
                    namaSaudaraKandung: 'Saudara Keenam',
                    jenisKelamin: 'PEREMPUAN',
                },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.createSaudaraKandung as jest.Mock).mockRejectedValue(
                new Error('Maksimal 5 saudara kandung')
            );

            await employeeController.createSaudaraKandungKaryawan(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Maksimal 5 saudara kandung',
                })
            );
        });
    });
});

// ==========================================
// QR CODE TESTS
// ==========================================

describe('Employee Controller - QR Code', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateKaryawanQRCode', () => {
        it('should return QR code as image', async () => {
            const req = {
                params: { id: mockKaryawan.id },
                query: { format: 'image' },
            } as unknown as Request;
            const res = mockResponse();

            const mockBuffer = Buffer.from('fake-qr-code');
            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.generateQRCodeBuffer as jest.Mock).mockResolvedValue(mockBuffer);

            await employeeController.generateKaryawanQRCode(req, res, mockNext);

            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/png');
            expect(res.send).toHaveBeenCalledWith(mockBuffer);
        });

        it('should return QR code as base64 JSON', async () => {
            const req = {
                params: { id: mockKaryawan.id },
                query: { format: 'base64' },
            } as unknown as Request;
            const res = mockResponse();

            const mockBase64 = 'data:image/png;base64,fake-base64';
            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.generateQRCodeBase64 as jest.Mock).mockResolvedValue(mockBase64);

            await employeeController.generateKaryawanQRCode(req, res, mockNext);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        qrcode: mockBase64,
                        nik: 'EMP001',
                    }),
                })
            );
        });

        it('should return 404 if karyawan not found', async () => {
            const req = {
                params: { id: 'non-existent-id' },
                query: {},
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(null);

            await employeeController.generateKaryawanQRCode(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});

// ==========================================
// FILE UPLOAD TESTS
// ==========================================

describe('Employee Controller - File Upload', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadKaryawanPhoto', () => {
        it('should upload photo successfully', async () => {
            const req = {
                params: { id: mockKaryawan.id },
                file: {
                    path: 'uploads/employees/photos/photo-123.jpg',
                    originalname: 'photo.jpg',
                    size: 1024,
                    mimetype: 'image/jpeg',
                },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.uploadPhoto as jest.Mock).mockResolvedValue({
                ...mockKaryawan,
                fotoKaryawan: 'uploads/employees/photos/photo-123.jpg',
            });

            await employeeController.uploadKaryawanPhoto(req, res, mockNext);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                })
            );
        });

        it('should return 400 if no file uploaded', async () => {
            const req = {
                params: { id: mockKaryawan.id },
                file: undefined,
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);

            await employeeController.uploadKaryawanPhoto(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'File foto tidak ditemukan',
                })
            );
        });
    });

    describe('uploadKaryawanDocument', () => {
        it('should upload document successfully', async () => {
            const req = {
                params: { id: mockKaryawan.id },
                body: { jenisDokumen: 'KTP', keterangan: 'Scan KTP' },
                file: {
                    path: 'uploads/employees/documents/doc-123.pdf',
                    originalname: 'ktp.pdf',
                    size: 2048,
                    mimetype: 'application/pdf',
                },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.uploadDocument as jest.Mock).mockResolvedValue({
                id: 'doc-id',
                jenisDokumen: 'KTP',
                namaFile: 'ktp.pdf',
            });

            await employeeController.uploadKaryawanDocument(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 400 if jenisDokumen missing', async () => {
            const req = {
                params: { id: mockKaryawan.id },
                body: {},
                file: {
                    path: 'uploads/employees/documents/doc-123.pdf',
                    originalname: 'doc.pdf',
                    size: 2048,
                    mimetype: 'application/pdf',
                },
            } as unknown as Request;
            const res = mockResponse();

            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);

            await employeeController.uploadKaryawanDocument(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Jenis dokumen wajib diisi',
                })
            );
        });
    });
});
