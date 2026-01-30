import request from 'supertest';
import express, { Express } from 'express';
import { prismaMock } from '../../__mocks__/prisma';
import roleRoutes from '../../routes/role.routes';
import { errorHandler } from '../../middleware/errorHandler';

jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: (req: any, _res: any, next: any) => {
        req.user = { id: 'test-admin-id', role: 'ADMIN' };
        next();
    },
    authorizeRoles: () => (req: any, _res: any, next: any) => next(),
    requirePermissions: () => (req: any, _res: any, next: any) => next(),
}));

const createTestApp = (): Express => {
    const app = express();
    app.use(express.json());
    app.use('/api/roles', roleRoutes);
    app.use(errorHandler);
    return app;
};

const mockRole = {
    id: 'role-123',
    name: 'Admin',
    code: 'ADMIN',
    description: 'Administrator',
    status: 'AKTIF',
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: [],
};

describe('Role Routes Integration', () => {
    let app: Express;

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/roles', () => {
        it('should return list of roles', async () => {
            prismaMock.role.findMany.mockResolvedValue([mockRole] as any);

            const response = await request(app).get('/api/roles');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
        });
    });

    describe('POST /api/roles', () => {
        it('should create new role', async () => {
            prismaMock.role.findUnique.mockResolvedValue(null);
            prismaMock.role.create.mockResolvedValue(mockRole as any);

            const response = await request(app)
                .post('/api/roles')
                .send({ name: 'Admin', code: 'ADMIN' });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });
    });
});
