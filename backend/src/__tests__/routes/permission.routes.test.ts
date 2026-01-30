import request from 'supertest';
import express, { Express } from 'express';
import { prismaMock } from '../../__mocks__/prisma';
import permissionRoutes from '../../routes/permission.routes';
import { errorHandler } from '../../middleware/errorHandler';

jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: (req: any, _res: any, next: any) => {
        req.user = { id: 'test-admin-id', role: 'ADMIN' };
        next();
    },
    requirePermissions: () => (req: any, _res: any, next: any) => next(),
}));

const createTestApp = (): Express => {
    const app = express();
    app.use(express.json());
    app.use('/api/permissions', permissionRoutes);
    app.use(errorHandler);
    return app;
};

const mockPermission = {
    id: 'perm-123',
    name: 'user.create',
    description: 'Create User',
    module: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('Permission Routes Integration', () => {
    let app: Express;

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/permissions', () => {
        it('should return list of permissions', async () => {
            prismaMock.permission.findMany.mockResolvedValue([mockPermission] as any);

            const response = await request(app).get('/api/permissions');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
        });
    });
});
