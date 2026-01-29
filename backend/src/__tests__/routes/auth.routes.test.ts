import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.routes';
import { login, getProfile, logout, getPermissions } from '../../controllers/auth.controller';
import { authenticateAndValidate } from '../../middleware/auth.middleware';

// Mock dependencies
jest.mock('../../controllers/auth.controller');
jest.mock('../../middleware/auth.middleware', () => ({
    authenticateAndValidate: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/login', () => {
        it('should call login controller', async () => {
            (login as jest.Mock).mockImplementation((req, res) => res.status(200).json({ success: true }));

            await request(app)
                .post('/api/auth/login')
                .send({ nik: '123', password: 'pass' })
                .expect(200);

            expect(login).toHaveBeenCalled();
        });
    });

    describe('GET /api/auth/profile', () => {
        it('should call getProfile controller', async () => {
            (getProfile as jest.Mock).mockImplementation((req, res) => res.status(200).json({ success: true }));

            await request(app)
                .get('/api/auth/profile')
                .expect(200);

            expect(authenticateAndValidate).toHaveBeenCalled();
            expect(getProfile).toHaveBeenCalled();
        });
    });

    describe('GET /api/auth/permissions', () => {
        it('should call getPermissions controller', async () => {
            (getPermissions as jest.Mock).mockImplementation((req, res) => res.status(200).json({ success: true }));

            await request(app)
                .get('/api/auth/permissions')
                .expect(200);

            expect(authenticateAndValidate).toHaveBeenCalled();
            expect(getPermissions).toHaveBeenCalled();
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should call logout controller', async () => {
            (logout as jest.Mock).mockImplementation((req, res) => res.status(200).json({ success: true }));

            await request(app)
                .post('/api/auth/logout')
                .expect(200);

            expect(authenticateAndValidate).toHaveBeenCalled();
            expect(logout).toHaveBeenCalled();
        });
    });
});
