import request from 'supertest';
import express from 'express';
import roleRoutes from '../../routes/role.routes';
import * as roleController from '../../controllers/role.controller';

// Mock dependencies
jest.mock('../../controllers/role.controller', () => ({
    getAllRoles: jest.fn((req, res) => res.status(200).json({ success: true })),
    getRoleById: jest.fn((req, res) => res.status(200).json({ success: true })),
    createRole: jest.fn((req, res) => res.status(201).json({ success: true })),
    updateRole: jest.fn((req, res) => res.status(200).json({ success: true })),
    deleteRole: jest.fn((req, res) => res.status(200).json({ success: true })),
    getRolePermissions: jest.fn((req, res) => res.status(200).json({ success: true })),
    assignPermissionsToRole: jest.fn((req, res) => res.status(200).json({ success: true })),
}));

jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: jest.fn((req: any, res: any, next: any) => next()),
    requirePermissions: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

const app = express();
app.use(express.json());
app.use('/api/roles', roleRoutes);

describe('Role Routes', () => {
    describe('GET /api/roles', () => {
        it('should call getAllRoles', async () => {
            await request(app).get('/api/roles').expect(200);
            expect(roleController.getAllRoles).toHaveBeenCalled();
        });
    });

    describe('POST /api/roles', () => {
        it('should call createRole', async () => {
            await request(app).post('/api/roles').send({ name: 'Role' }).expect(201);
            expect(roleController.createRole).toHaveBeenCalled();
        });
    });

    describe('DELETE /api/roles/:id', () => {
        it('should call deleteRole', async () => {
            await request(app).delete('/api/roles/1').expect(200);
            expect(roleController.deleteRole).toHaveBeenCalled();
        });
    });
});
