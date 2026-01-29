import { Request, Response } from 'express';
import { importController } from '../../controllers/import.controller';
import { importService } from '../../services/import.service';
import { ApiError } from '../../middleware/errorHandler';

// Mock dependencies
jest.mock('../../services/import.service');

describe('Import Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            setHeader: jest.fn(),
            send: jest.fn(),
        };
        nextFunction = jest.fn();
        jest.clearAllMocks();
    });

    describe('downloadTemplate', () => {
        it('should download template successfully', async () => {
            const mockPath = 'path/to/template.xlsx';
            (importService.getTemplatePath as jest.Mock).mockReturnValue(mockPath);

            await importController.downloadTemplate(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.download).toHaveBeenCalledWith(mockPath, 'Employee_Import_Template.xlsx');
        });
    });

    describe('uploadAndPreviewExcel', () => {
        it('should preview excel data successfully', async () => {
            const mockFile = { buffer: Buffer.from('mock-excel') } as Express.Multer.File;
            mockRequest.file = mockFile;

            const mockPreview = {
                validRows: [],
                invalidRows: [],
                totalRows: 0,
                canImport: true
            };

            (importService.previewImport as jest.Mock).mockResolvedValue(mockPreview);

            await importController.uploadAndPreviewExcel(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockPreview
            }));
        });

        it('should fail if no file provided', async () => {
            mockRequest.file = undefined;

            await importController.uploadAndPreviewExcel(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalledWith(expect.any(ApiError));
        });
    });

    describe('confirmImport', () => {
        it('should confirm import successfully', async () => {
            const mockResult = {
                successCount: 1,
                errors: []
            };

            // Fix: confirmImport likely uses filePath from body, simulating previous upload
            mockRequest.body = { filePath: 'temp/file.xlsx' };
            (importService.executeImport as jest.Mock).mockResolvedValue(mockResult);

            await importController.confirmImport(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockResult
            }));
        });
    });
});
