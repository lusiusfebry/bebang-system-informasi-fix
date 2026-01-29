/**
 * HR Master Routes Integration Tests
 * Tests untuk routing, middleware chain, dan response format
 */

import request from 'supertest';
import express, { Express } from 'express';
import { prismaMock } from '../../__mocks__/prisma';
import hrMasterRoutes from '../../routes/hr-master.routes';

// Mock auth middleware to bypass authentication for tests
jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: (req: any, _res: any, next: any) => {
        req.user = { id: 'test-user-id', role: 'ADMIN' };
        next();
    },
    requirePermissions: () => (req: any, _res: any, next: any) => next(),
}));

// Create test app
const createTestApp = (): Express => {
    const app = express();
    app.use(express.json());
    app.use('/api/hr/master', hrMasterRoutes);
    return app;
};

// Sample data
const mockDivisi = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    namaDivisi: 'Divisi IT',
    keterangan: 'Mengelola teknologi informasi',
    status: 'AKTIF' as const,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};

const mockTag = {
    id: '550e8400-e29b-41d4-a716-446655440030',
    namaTag: 'Urgent',
    warnaTag: '#FF0000',
    keterangan: 'Tag untuk item urgent',
    status: 'AKTIF' as const,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};

// Valid UUID format but non-existent in database
const nonExistentId = '00000000-0000-0000-0000-000000000000';

describe('HR Master Routes Integration Tests', () => {
    let app: Express;

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==========================================
    // DIVISI ROUTES TESTS
    // ==========================================

    describe('GET /api/hr/master/divisi', () => {
        it('should return paginated divisi list', async () => {
            prismaMock.divisi.findMany.mockResolvedValue([mockDivisi]);
            prismaMock.divisi.count.mockResolvedValue(1);

            const response = await request(app)
                .get('/api/hr/master/divisi')
                .query({ page: 1, limit: 10 });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.meta).toBeDefined();
        });

        it('should filter by status query param', async () => {
            prismaMock.divisi.findMany.mockResolvedValue([mockDivisi]);
            prismaMock.divisi.count.mockResolvedValue(1);

            const response = await request(app)
                .get('/api/hr/master/divisi')
                .query({ status: 'AKTIF' });

            expect(response.status).toBe(200);
            expect(prismaMock.divisi.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        status: 'AKTIF',
                    }),
                })
            );
        });

        it('should search by search query param', async () => {
            prismaMock.divisi.findMany.mockResolvedValue([mockDivisi]);
            prismaMock.divisi.count.mockResolvedValue(1);

            const response = await request(app)
                .get('/api/hr/master/divisi')
                .query({ search: 'IT' });

            expect(response.status).toBe(200);
        });
    });

    describe('GET /api/hr/master/divisi/:id', () => {
        it('should return divisi by id', async () => {
            prismaMock.divisi.findUnique.mockResolvedValue(mockDivisi);

            const response = await request(app)
                .get(`/api/hr/master/divisi/${mockDivisi.id}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(mockDivisi.id);
        });

        it('should return 404 for non-existent divisi', async () => {
            prismaMock.divisi.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .get(`/api/hr/master/divisi/${nonExistentId}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/hr/master/divisi', () => {
        it('should create new divisi', async () => {
            prismaMock.divisi.create.mockResolvedValue(mockDivisi);

            const response = await request(app)
                .post('/api/hr/master/divisi')
                .send({
                    namaDivisi: 'Divisi IT',
                    keterangan: 'Test',
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });

        it('should return 400 for validation errors', async () => {
            const response = await request(app)
                .post('/api/hr/master/divisi')
                .send({
                    // Missing required namaDivisi
                    keterangan: 'Test',
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error.details).toBeDefined();
        });

        it('should return 400 for empty namaDivisi', async () => {
            const response = await request(app)
                .post('/api/hr/master/divisi')
                .send({
                    namaDivisi: '',
                });

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /api/hr/master/divisi/:id', () => {
        it('should update divisi', async () => {
            prismaMock.divisi.findUnique.mockResolvedValue(mockDivisi);
            prismaMock.divisi.update.mockResolvedValue({
                ...mockDivisi,
                namaDivisi: 'Updated',
            });

            const response = await request(app)
                .put(`/api/hr/master/divisi/${mockDivisi.id}`)
                .send({
                    namaDivisi: 'Updated',
                });

            expect(response.status).toBe(200);
            expect(response.body.data.namaDivisi).toBe('Updated');
        });

        it('should return 404 for non-existent divisi', async () => {
            prismaMock.divisi.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .put(`/api/hr/master/divisi/${nonExistentId}`)
                .send({
                    namaDivisi: 'Updated',
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/hr/master/divisi/:id', () => {
        it('should soft delete divisi', async () => {
            prismaMock.divisi.findUnique.mockResolvedValue(mockDivisi);
            prismaMock.divisi.update.mockResolvedValue({
                ...mockDivisi,
                status: 'TIDAK_AKTIF' as const,
            });

            const response = await request(app)
                .delete(`/api/hr/master/divisi/${mockDivisi.id}`);

            expect(response.status).toBe(200);
            expect(prismaMock.divisi.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        status: 'TIDAK_AKTIF',
                    }),
                })
            );
        });

        it('should return 404 for non-existent divisi', async () => {
            prismaMock.divisi.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .delete(`/api/hr/master/divisi/${nonExistentId}`);

            expect(response.status).toBe(404);
        });
    });

    // ==========================================
    // TAG ROUTES TESTS (Hex Color Validation)
    // ==========================================

    describe('POST /api/hr/master/tag', () => {
        it('should create tag with valid hex color', async () => {
            prismaMock.tag.create.mockResolvedValue(mockTag);

            const response = await request(app)
                .post('/api/hr/master/tag')
                .send({
                    namaTag: 'Urgent',
                    warnaTag: '#FF0000',
                });

            expect(response.status).toBe(201);
        });

        it('should return 400 for invalid hex color format', async () => {
            const response = await request(app)
                .post('/api/hr/master/tag')
                .send({
                    namaTag: 'Invalid Tag',
                    warnaTag: 'not-hex-color',
                });

            expect(response.status).toBe(400);
        });
    });

    // ==========================================
    // OTHER ENTITY ROUTES TESTS
    // ==========================================

    const entityRoutes = [
        { path: '/api/hr/master/department', mock: 'department' },
        { path: '/api/hr/master/posisi-jabatan', mock: 'posisiJabatan' },
        { path: '/api/hr/master/kategori-pangkat', mock: 'kategoriPangkat' },
        { path: '/api/hr/master/golongan', mock: 'golongan' },
        { path: '/api/hr/master/sub-golongan', mock: 'subGolongan' },
        { path: '/api/hr/master/jenis-hubungan-kerja', mock: 'jenisHubunganKerja' },
        { path: '/api/hr/master/lokasi-kerja', mock: 'lokasiKerja' },
        { path: '/api/hr/master/status-karyawan', mock: 'statusKaryawan' },
    ];

    entityRoutes.forEach(({ path, mock }) => {
        describe(`GET ${path}`, () => {
            it('should return paginated list', async () => {
                (prismaMock as any)[mock].findMany.mockResolvedValue([]);
                (prismaMock as any)[mock].count.mockResolvedValue(0);

                const response = await request(app)
                    .get(path)
                    .query({ page: 1, limit: 10 });

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
            });
        });
    });

    // ==========================================
    // RESPONSE FORMAT TESTS
    // ==========================================

    describe('Response Format', () => {
        it('should return proper success response format', async () => {
            prismaMock.divisi.findMany.mockResolvedValue([mockDivisi]);
            prismaMock.divisi.count.mockResolvedValue(1);

            const response = await request(app)
                .get('/api/hr/master/divisi');

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('meta');
            expect(response.body.meta).toHaveProperty('page');
            expect(response.body.meta).toHaveProperty('limit');
            expect(response.body.meta).toHaveProperty('total');
            expect(response.body.meta).toHaveProperty('totalPages');
        });

        it('should return proper error response format', async () => {
            prismaMock.divisi.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .get(`/api/hr/master/divisi/${nonExistentId}`);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message');
        });
    });

    // ==========================================
    // 404 ROUTE TESTS
    // ==========================================

    describe('Non-existent Routes', () => {
        it('should handle non-existent routes gracefully', async () => {
            const response = await request(app)
                .get('/api/hr/master/non-existent-entity');

            expect(response.status).toBe(404);
        });
    });
});
