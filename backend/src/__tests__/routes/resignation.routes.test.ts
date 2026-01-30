import request from 'supertest';
import express, { Express } from 'express';
import { prismaMock } from '../../__mocks__/prisma';
import resignationRoutes from '../../routes/resignation.routes';
import { errorHandler } from '../../middleware/errorHandler';

jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: (req: any, _res: any, next: any) => {
        req.user = { id: 'test-user-id', role: 'ADMIN' };
        next();
    },
    requirePermissions: () => (req: any, _res: any, next: any) => next(),
}));

const createTestApp = (): Express => {
    const app = express();
    app.use(express.json());
    app.use('/api/hr/resignations', resignationRoutes);
    app.use(errorHandler);
    return app;
};

const mockResignation = {
    id: 'res-123',
    karyawanId: 'emp-123',
    tanggalPengajuan: new Date(),
    tanggalEfektif: new Date(),
    alasan: 'Resign',
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
    karyawan: { namaLengkap: 'Budi' },
};

describe('Resignation Routes Integration', () => {
    let app: Express;

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/hr/resignations', () => {
        it('should return list ofresignations', async () => {
            (prismaMock as any).resignation.findMany.mockResolvedValue([mockResignation]);
            (prismaMock as any).resignation.count.mockResolvedValue(1);

            const response = await request(app).get('/api/hr/resignations');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /api/hr/resignations', () => {
        it('should create resignation', async () => {
            (prismaMock as any).resignation.create.mockResolvedValue(mockResignation);

            const response = await request(app)
                .post('/api/hr/resignations')
                .send({
                    tanggalEfektif: '2024-12-01',
                    alasan: 'Reason'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });
    });
});
