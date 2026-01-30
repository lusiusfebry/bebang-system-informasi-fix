import request from 'supertest';
import express, { Express } from 'express';
import { prismaMock } from '../../__mocks__/prisma';
import employeeRoutes from '../../routes/employee.routes';
import { errorHandler } from '../../middleware/errorHandler';

// Mock auth middleware
jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: (req: any, _res: any, next: any) => {
        req.user = { id: 'test-user-id', email: 'test@example.com', role: 'ADMIN' };
        next();
    },
    requirePermissions: () => (req: any, _res: any, next: any) => next(),
}));

// Mock upload config to avoid file system ops
jest.mock('../../config/upload', () => ({
    uploadEmployeePhoto: {
        single: () => (req: any, _res: any, next: any) => next(),
    },
    uploadEmployeeDocument: {
        single: () => (req: any, _res: any, next: any) => next(),
    },
    deleteFile: jest.fn(),
    getFilePath: jest.fn(),
}));

const createTestApp = (): Express => {
    const app = express();
    app.use(express.json());
    app.use('/api/hr/employees', employeeRoutes);
    app.use(errorHandler);
    return app;
};

const mockKaryawan = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    namaLengkap: 'Budi Santoso',
    nomorIndukKaryawan: 'EMP001',
    nomorHandphone: '081234567890',
    emailPerusahaan: 'budi@company.com',
    fotoKaryawan: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    divisi: { id: '550e8400-e29b-41d4-a716-446655440001', namaDivisi: 'IT' },
    department: { id: '550e8400-e29b-41d4-a716-446655440002', namaDepartment: 'Dev' },
};

describe('Employee Routes Integration', () => {
    let app: Express;

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/hr/employees', () => {
        it('should return paginated employees', async () => {
            prismaMock.karyawan.findMany.mockResolvedValue([mockKaryawan] as any);
            prismaMock.karyawan.count.mockResolvedValue(1);

            const response = await request(app)
                .get('/api/hr/employees')
                .query({ page: 1, limit: 10 });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
        });
    });

    describe('GET /api/hr/employees/:id', () => {
        it('should return employee by id', async () => {
            prismaMock.karyawan.findUnique.mockResolvedValue(mockKaryawan as any);

            const response = await request(app).get(`/api/hr/employees/${mockKaryawan.id}`);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(mockKaryawan.id);
        });

        it('should return 404 if not found', async () => {
            prismaMock.karyawan.findUnique.mockResolvedValue(null);

            const response = await request(app).get('/api/hr/employees/non-existent-uuid');

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/hr/employees', () => {
        it('should create new employee', async () => {
            prismaMock.karyawan.create.mockResolvedValue(mockKaryawan as any);
            // Mock transaction
            prismaMock.$transaction.mockImplementation((callback: any) => callback(prismaMock));

            const response = await request(app)
                .post('/api/hr/employees')
                .send({
                    namaLengkap: 'Budi Santoso',
                    nomorIndukKaryawan: 'EMP001',
                    emailPerusahaan: 'budi@company.com',
                    nomorHandphone: '081234567890',
                    divisiId: '550e8400-e29b-41d4-a716-446655440001',
                    departmentId: '550e8400-e29b-41d4-a716-446655440002'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });
    });
});
