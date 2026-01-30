import request from 'supertest';
import express, { Express } from 'express';
import { prismaMock } from '../../__mocks__/prisma';
import userRoutes from '../../routes/user.routes';
import { errorHandler } from '../../middleware/errorHandler';

// Mock auth middleware
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
    app.use('/api/users', userRoutes);
    app.use(errorHandler);
    return app;
};

const mockUser = {
    id: 'user-123',
    nik: '12345',
    email: 'test@example.com',
    fullName: 'Test User',
    password: 'hashed-password',
    roleId: 'role-123',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: { id: 'role-123', name: 'USER', code: 'USER' },
    permissions: [],
};

describe('User Routes Integration', () => {
    let app: Express;

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/users', () => {
        it('should return paginated users', async () => {
            prismaMock.user.findMany.mockResolvedValue([mockUser] as any);
            prismaMock.user.count.mockResolvedValue(1);

            const response = await request(app).get('/api/users');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return user by id', async () => {
            prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

            const response = await request(app).get(`/api/users/${mockUser.id}`);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(mockUser.id);
        });

        it('should return 404 if user not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            const response = await request(app).get('/api/users/non-existent');

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/users', () => {
        it('should create new user', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null); // No existing Nik
            prismaMock.user.create.mockResolvedValue(mockUser as any);

            const response = await request(app)
                .post('/api/users')
                .send({
                    nik: '12345',
                    password: 'password123',
                    fullName: 'New User',
                    email: 'newuser@example.com',
                    roleId: 'role-123'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });
    });
});
