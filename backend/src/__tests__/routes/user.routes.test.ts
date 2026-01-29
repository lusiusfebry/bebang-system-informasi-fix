import request from 'supertest';
import express from 'express';
import userRoutes from '../../routes/user.routes';
import * as userController from '../../controllers/user.controller';

// Mock dependencies
jest.mock('../../controllers/user.controller', () => ({
    getAllUsers: jest.fn((req, res) => res.status(200).json({ success: true })),
    getUserById: jest.fn((req, res) => res.status(200).json({ success: true })),
    createUser: jest.fn((req, res) => res.status(201).json({ success: true })),
    updateUser: jest.fn((req, res) => res.status(200).json({ success: true })),
    deleteUser: jest.fn((req, res) => res.status(200).json({ success: true })),
    assignRoleToUser: jest.fn((req, res) => res.status(200).json({ success: true })),
}));

jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: jest.fn((req, res, next) => next()),
    requirePermissions: jest.fn(() => (req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
    describe('GET /api/users', () => {
        it('should call getAllUsers', async () => {
            await request(app).get('/api/users').expect(200);
            expect(userController.getAllUsers).toHaveBeenCalled();
        });
    });

    describe('POST /api/users', () => {
        it('should call createUser', async () => {
            await request(app).post('/api/users').send({ nik: '123' }).expect(201);
            expect(userController.createUser).toHaveBeenCalled();
        });
    });

    describe('POST /api/users/:id/role', () => {
        it('should call assignRoleToUser', async () => {
            await request(app).post('/api/users/1/role').send({ roleId: '1' }).expect(200);
            expect(userController.assignRoleToUser).toHaveBeenCalled();
        });
    });
});
