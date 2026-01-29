import request from 'supertest';
import express from 'express';
import importRoutes from '../../routes/import.routes';
import { importController } from '../../controllers/import.controller';

// Mock dependencies
jest.mock('../../controllers/import.controller', () => ({
    importController: {
        downloadTemplate: jest.fn((req, res) => res.status(200).send('template')),
        uploadAndPreviewExcel: jest.fn((req, res) => res.status(200).json({ success: true })),
        confirmImport: jest.fn((req, res) => res.status(200).json({ success: true })),
    }
}));

jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: jest.fn((req, res, next) => next()),
    requirePermissions: jest.fn(() => (req, res, next) => next()),
}));

jest.mock('../../config/upload', () => ({
    uploadExcelFile: {
        single: jest.fn(() => (req, res, next) => next()),
    }
}));

const app = express();
app.use(express.json());
app.use('/api/hr/import', importRoutes);

describe('Import Routes', () => {
    describe('GET /api/hr/import/template', () => {
        it('should call downloadTemplate', async () => {
            await request(app)
                .get('/api/hr/import/template')
                .expect(200);

            expect(importController.downloadTemplate).toHaveBeenCalled();
        });
    });

    describe('POST /api/hr/import/upload', () => {
        it('should call uploadAndPreviewExcel', async () => {
            await request(app)
                .post('/api/hr/import/upload')
                .attach('file', Buffer.from('dummy'), 'test.xlsx')
                .expect(200);

            expect(importController.uploadAndPreviewExcel).toHaveBeenCalled();
        });
    });

    describe('POST /api/hr/import/confirm', () => {
        it('should call confirmImport', async () => {
            await request(app)
                .post('/api/hr/import/confirm')
                .send({ filePath: 'path/to/file' })
                .expect(200);

            expect(importController.confirmImport).toHaveBeenCalled();
        });
    });
});
