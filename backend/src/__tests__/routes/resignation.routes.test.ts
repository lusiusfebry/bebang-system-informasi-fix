import request from 'supertest';
import express from 'express';
import resignationRoutes from '../../routes/resignation.routes';
import { resignationController } from '../../controllers/resignation.controller';

// Mock dependencies
jest.mock('../../controllers/resignation.controller', () => ({
    resignationController: {
        findAll: jest.fn((req, res) => res.status(200).json({ success: true })),
        findById: jest.fn((req, res) => res.status(200).json({ success: true })),
        create: jest.fn((req, res) => res.status(201).json({ success: true })),
        approve: jest.fn((req, res) => res.status(200).json({ success: true })),
        reject: jest.fn((req, res) => res.status(200).json({ success: true })),
    }
}));

jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: jest.fn((req, res, next) => next()),
    requirePermissions: jest.fn(() => (req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/api/hr/resignations', resignationRoutes);

describe('Resignation Routes', () => {
    describe('GET /api/hr/resignations', () => {
        it('should call findAll', async () => {
            await request(app).get('/api/hr/resignations').expect(200);
            expect(resignationController.findAll).toHaveBeenCalled();
        });
    });

    describe('POST /api/hr/resignations', () => {
        it('should call create', async () => {
            await request(app).post('/api/hr/resignations').send({ reason: 'test' }).expect(201);
            expect(resignationController.create).toHaveBeenCalled();
        });
    });

    describe('PATCH /api/hr/resignations/:id/approve', () => {
        it('should call approve', async () => {
            await request(app).patch('/api/hr/resignations/1/approve').expect(200);
            expect(resignationController.approve).toHaveBeenCalled();
        });
    });
});
