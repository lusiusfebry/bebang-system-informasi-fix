import request from 'supertest';
import express from 'express';
import permissionRoutes from '../../routes/permission.routes';
import * as permissionController from '../../controllers/permission.controller';

// Mock dependencies
jest.mock('../../controllers/permission.controller', () => ({
    getAllPermissions: jest.fn((req, res) => res.status(200).json({ success: true })),
    getPermissionsByModule: jest.fn(),
}));

jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: jest.fn((req: any, res: any, next: any) => next()),
    requirePermissions: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

const app = express();
app.use(express.json());
app.use('/api/permissions', permissionRoutes);

describe('Permission Routes', () => {
    describe('GET /api/permissions', () => {
        it('should call getAllPermissions', async () => {
            await request(app).get('/api/permissions').expect(200);
            expect(permissionController.getAllPermissions).toHaveBeenCalled();
        });
    });
});
