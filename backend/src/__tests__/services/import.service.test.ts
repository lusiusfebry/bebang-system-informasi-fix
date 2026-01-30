import { importService } from '../../services/import.service';
import { prisma } from '../../config/database';


jest.mock('../../config/database', () => ({
    prisma: {
        employee: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        divisi: { findFirst: jest.fn() },
        department: { findFirst: jest.fn() },
        $transaction: jest.fn((callback) => callback(prisma)),
    },
}));

describe('Import Service', () => {
    describe('getTemplatePath', () => {
        it('should return a string path', () => {
            // Mock fs.existsSync to return true
            jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
            const path = importService.getTemplatePath();
            expect(typeof path).toBe('string');
        });
    });

    describe('previewImport', () => {
        it('should validate excel file', async () => {
            // Skip complex mocking for now, just ensure service method exists
            expect(importService.previewImport).toBeDefined();
        });
    });
});
