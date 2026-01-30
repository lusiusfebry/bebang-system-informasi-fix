import request from 'supertest';
import express, { Express } from 'express';
import { prismaMock } from '../../__mocks__/prisma';
import authRoutes from '../../routes/auth.routes';
import { errorHandler } from '../../middleware/errorHandler';

// Mock dependencies
jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: (req: any, _res: any, next: any) => {
        req.user = { userId: 'test-user-id', roleCode: 'ADMIN' };
        next();
    },
    authenticateAndValidate: (req: any, _res: any, next: any) => {
        req.user = { userId: 'test-user-id', roleCode: 'ADMIN' };
        next();
    },
    authorizeRoles: () => (req: any, _res: any, next: any) => next(),
}));

const createTestApp = (): Express => {
    const app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use(errorHandler);
    return app;
};

describe('Auth Routes Integration', () => {
    let app: Express;

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/login', () => {
        it('should return 400 for missing credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/auth/profile', () => {
        it('should return user profile', async () => {
            const mockUser = {
                id: 'test-user-id',
                nik: '12345',
                fullName: 'Test User',
                email: 'test@example.com',
                role: { code: 'ADMIN', name: 'Admin' },
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

            const response = await request(app)
                .get('/api/auth/profile');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
});
