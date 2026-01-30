import { Request, Response } from 'express';
import { resignationController } from '../../controllers/resignation.controller';
import { resignationService } from '../../services/resignation.service';
import { ApiError } from '../../middleware/errorHandler';

// Mock dependencies
jest.mock('../../services/resignation.service');

describe('Resignation Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        nextFunction = jest.fn();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create resignation successfully', async () => {
            const mockResignation = { id: '1', status: 'PENDING' };
            mockRequest.body = { reason: 'Resign' };
            (mockRequest as any).user = { userId: 'user-1', nik: '123', roleId: 'role-1', roleCode: 'EMP', permissions: [] };

            (resignationService.create as jest.Mock).mockResolvedValue(mockResignation);

            await resignationController.create(mockRequest as any, mockResponse as Response);

            expect(resignationService.create).toHaveBeenCalledWith(expect.anything());
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockResignation
            }));
        });
    });

    describe('approve', () => {
        it('should approve resignation', async () => {
            const mockResignation = { id: '1', status: 'APPROVED' };
            mockRequest.params = { id: '1' };

            (resignationService.updateStatus as jest.Mock).mockResolvedValue(mockResignation);
            (mockRequest as any).user = { userId: 'admin-1' };

            await resignationController.approve(mockRequest as any, mockResponse as Response);

            expect(resignationService.updateStatus).toHaveBeenCalledWith('1', 'APPROVED', 'admin-1');
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockResignation
            }));
        });
    });

    describe('reject', () => {
        it('should reject resignation', async () => {
            const mockResignation = { id: '1', status: 'REJECTED' };
            mockRequest.params = { id: '1' };

            (resignationService.updateStatus as jest.Mock).mockResolvedValue(mockResignation);
            (mockRequest as any).user = { userId: 'admin-1' };
            mockRequest.body = { reason: 'Rejected' };

            await resignationController.reject(mockRequest as any, mockResponse as Response);

            expect(resignationService.updateStatus).toHaveBeenCalledWith('1', 'REJECTED', 'admin-1', 'Rejected');
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockResignation
            }));
        });
    });

    describe('findAll', () => {
        it('should return list of resignations', async () => {
            mockRequest.query = { page: '1', limit: '10' };
            (resignationService.findAll as jest.Mock).mockResolvedValue({
                data: [],
                meta: { page: 1, limit: 10, total: 0, totalPages: 0 }
            });

            await resignationController.findAll(mockRequest as any, mockResponse as Response);

            expect(resignationService.findAll).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true
            }));
        });
    });
});
