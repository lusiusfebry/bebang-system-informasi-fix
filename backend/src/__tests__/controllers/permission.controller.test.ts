import { Request, Response } from 'express';
import { getAllPermissions } from '../../controllers/permission.controller';
import { prisma } from '../../config/database';

// Mock dependencies
jest.mock('../../config/database', () => ({
    prisma: {
        permission: {
            findMany: jest.fn(),
        },
    },
}));

describe('Permission Controller', () => {
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

    describe('getAllPermissions', () => {
        it('should return grouped permissions', async () => {
            const mockPermissions = [
                { id: '1', name: 'user.read', module: 'USER' },
                { id: '2', name: 'user.create', module: 'USER' }
            ];
            (prisma.permission.findMany as jest.Mock).mockResolvedValue(mockPermissions);

            await getAllPermissions(mockRequest as any, mockResponse as Response, nextFunction);

            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: expect.any(Object)
            }));
        });
    });
});
