/**
 * Employee Routes Integration Tests
 * Tests untuk Employee Management Routes dengan Supertest
 */

import request from 'supertest';
import express, { Express } from 'express';
import employeeRoutes from '../../routes/employee.routes';

// Mock the auth middleware
jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: jest.fn((req: any, res: any, next: any) => {
        (req as any).user = { id: 'test-user-id', email: 'test@example.com' };
        next();
    }),
    requirePermissions: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

// Mock employee service
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

// Mock upload config
jest.mock('../../config/upload', () => ({
    uploadEmployeePhoto: {
        single: () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
            next();
        },
    },
    uploadEmployeeDocument: {
        single: () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
            next();
        },
    },
}));

import { employeeService } from '../../services/employee.service';

// Create test app
const createTestApp = (): Express => {
    const app = express();
    app.use(express.json());
    app.use('/api/hr/employees', employeeRoutes);
    return app;
};

// Sample test data
const mockKaryawan = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    namaLengkap: 'Budi Santoso',
    nomorIndukKaryawan: 'EMP001',
    nomorHandphone: '081234567890',
    fotoKaryawan: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};

describe('Employee Routes', () => {
    let app: Express;

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==========================================
    // GET ROUTES
    // ==========================================

    describe('GET /api/hr/employees', () => {
        it('should return paginated list of employees', async () => {
            (employeeService.findAll as jest.Mock).mockResolvedValue({
                data: [mockKaryawan],
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1,
            });

            const response = await request(app)
                .get('/api/hr/employees')
                .query({ page: 1, limit: 10 })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.meta.total).toBe(1);
        });

        it('should accept search query parameter', async () => {
            (employeeService.findAll as jest.Mock).mockResolvedValue({
                data: [mockKaryawan],
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1,
            });

            await request(app)
                .get('/api/hr/employees')
                .query({ search: 'Budi' })
                .expect(200);

            expect(employeeService.findAll).toHaveBeenCalledWith(
                expect.objectContaining({ search: 'Budi' })
            );
        });

        it('should accept filter parameters', async () => {
            (employeeService.findAll as jest.Mock).mockResolvedValue({
                data: [],
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
            });

            await request(app)
                .get('/api/hr/employees')
                .query({ divisiId: '550e8400-e29b-41d4-a716-446655440010' })
                .expect(200);

            expect(employeeService.findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    divisiId: '550e8400-e29b-41d4-a716-446655440010',
                })
            );
        });
    });

    describe('GET /api/hr/employees/:id', () => {
        it('should return employee by id', async () => {
            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);

            const response = await request(app)
                .get(`/api/hr/employees/${mockKaryawan.id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(mockKaryawan.id);
        });

        it('should return 404 if employee not found', async () => {
            (employeeService.findById as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get('/api/hr/employees/non-existent-id')
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/hr/employees/nik/:nik', () => {
        it('should return employee by NIK', async () => {
            (employeeService.findByNIK as jest.Mock).mockResolvedValue(mockKaryawan);

            const response = await request(app)
                .get('/api/hr/employees/nik/EMP001')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.nomorIndukKaryawan).toBe('EMP001');
        });
    });

    // ==========================================
    // POST ROUTES
    // ==========================================

    describe('POST /api/hr/employees', () => {
        it('should create new employee', async () => {
            const newEmployee = { ...mockKaryawan, id: 'new-id' };
            (employeeService.create as jest.Mock).mockResolvedValue(newEmployee);

            const response = await request(app)
                .post('/api/hr/employees')
                .send({
                    namaLengkap: 'Budi Santoso',
                    nomorIndukKaryawan: 'EMP001',
                    nomorHandphone: '081234567890',
                })
                .expect(201);

            expect(response.body.success).toBe(true);
        });

        it('should return validation error for missing required fields', async () => {
            const response = await request(app)
                .post('/api/hr/employees')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    // ==========================================
    // PUT ROUTES
    // ==========================================

    describe('PUT /api/hr/employees/:id', () => {
        it('should update employee', async () => {
            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.update as jest.Mock).mockResolvedValue({
                ...mockKaryawan,
                namaLengkap: 'Updated Name',
            });

            const response = await request(app)
                .put(`/api/hr/employees/${mockKaryawan.id}`)
                .send({ namaLengkap: 'Updated Name' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.namaLengkap).toBe('Updated Name');
        });
    });

    // ==========================================
    // DELETE ROUTES
    // ==========================================

    describe('DELETE /api/hr/employees/:id', () => {
        it('should delete employee', async () => {
            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.delete as jest.Mock).mockResolvedValue(mockKaryawan);

            const response = await request(app)
                .delete(`/api/hr/employees/${mockKaryawan.id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should return 404 if employee not found', async () => {
            (employeeService.findById as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/hr/employees/non-existent-id')
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    // ==========================================
    // CHILD DATA ROUTES - ANAK
    // ==========================================

    describe('POST /api/hr/employees/:id/anak', () => {
        it('should add child to employee', async () => {
            const mockAnak = {
                id: 'anak-id',
                karyawanId: mockKaryawan.id,
                urutanAnak: 1,
                namaAnak: 'Anak Pertama',
            };

            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.createAnak as jest.Mock).mockResolvedValue(mockAnak);

            const response = await request(app)
                .post(`/api/hr/employees/${mockKaryawan.id}/anak`)
                .send({
                    urutanAnak: 1,
                    namaAnak: 'Anak Pertama',
                    jenisKelamin: 'LAKI_LAKI',
                    tanggalLahir: '2015-05-20',
                })
                .expect(201);

            expect(response.body.success).toBe(true);
        });
    });

    // ==========================================
    // QR CODE ROUTE
    // ==========================================

    describe('GET /api/hr/employees/:id/qrcode', () => {
        it('should return QR code as base64', async () => {
            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.generateQRCodeBase64 as jest.Mock).mockResolvedValue(
                'data:image/png;base64,fake-base64'
            );

            const response = await request(app)
                .get(`/api/hr/employees/${mockKaryawan.id}/qrcode`)
                .query({ format: 'base64' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.qrcode).toBe('data:image/png;base64,fake-base64');
        });

        it('should return QR code as image', async () => {
            const mockBuffer = Buffer.from('fake-png-data');
            (employeeService.findById as jest.Mock).mockResolvedValue(mockKaryawan);
            (employeeService.generateQRCodeBuffer as jest.Mock).mockResolvedValue(mockBuffer);

            const response = await request(app)
                .get(`/api/hr/employees/${mockKaryawan.id}/qrcode`)
                .query({ format: 'image' })
                .expect(200);

            expect(response.headers['content-type']).toBe('image/png');
        });
    });
});
