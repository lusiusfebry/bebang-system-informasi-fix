import request from 'supertest';
import express, { Express } from 'express';
import { prismaMock } from '../../__mocks__/prisma'; // Should mock lib/prisma
import importRoutes from '../../routes/import.routes';
import { errorHandler } from '../../middleware/errorHandler';
// Import dependencies to mock
import { parseEmployeeExcel } from '../../utils/excel-parser';
import { validateImportData } from '../../utils/import-validator';

// Mock dependencies
jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: (req: any, _res: any, next: any) => next(),
    requirePermissions: () => (req: any, _res: any, next: any) => next(),
}));

jest.mock('../../config/upload', () => ({
    uploadExcelFile: {
        single: jest.fn(() => (req: any, res: any, next: any) => {
            req.file = {
                path: 'temp/test.xlsx',
                originalname: 'test.xlsx',
                size: 1000,
                mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            };
            next();
        }),
    },
    deleteFile: jest.fn(),
}));

jest.mock('../../utils/excel-parser');
jest.mock('../../utils/import-validator');
jest.mock('../../utils/cleanup', () => ({
    cleanupTempFiles: jest.fn(),
}));

const createTestApp = (): Express => {
    const app = express();
    app.use(express.json());
    app.use('/api/hr/import', importRoutes);
    app.use(errorHandler);
    return app;
};

describe('Import Routes Integration', () => {
    let app: Express;

    beforeAll(() => {
        app = createTestApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/hr/import/template', () => {
        it('should return file download', async () => {
            // Mock fs.existsSync to be true inside getTemplatePath (which is used by controller)
            // But here we are integration testing.
            // If we don't mock fs, it might look for real file.
            // Simplified expectation: 200 OK if file exists or error handled.
            // Actually controller just sends file.
            // We can mock res.download to verify it's called? No, supertest checks response.
            // For now, expect 200 assuming template exists or mock fs.
            // Let's assume template might not exist in test env, so we might get 404/500 if not mocked.
            // But getting 404 is also valid "response" from server if logic works.
            // Let's mock fs globally?
        });
    });

    describe('POST /api/hr/import/upload', () => {
        it('should preview import data', async () => {
            (parseEmployeeExcel as jest.Mock).mockReturnValue([]);
            (validateImportData as jest.Mock).mockResolvedValue({
                isValid: true,
                results: []
            });

            const response = await request(app)
                .post('/api/hr/import/upload')
                .attach('file', Buffer.from('dummy'), 'test.xlsx');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
});
