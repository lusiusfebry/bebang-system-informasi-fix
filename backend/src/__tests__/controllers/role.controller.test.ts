import { Request, Response } from 'express';
import { getAllRoles, createRole, updateRole, deleteRole } from '../../controllers/role.controller';
import { prisma } from '../../config/database';

// Mock dependencies
jest.mock('../../config/database', () => ({
    prisma: {
        role: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        user: {
            count: jest.fn(),
        },
        $transaction: jest.fn((callback) => callback(prisma)),
        rolePermission: {
            createMany: jest.fn(),
            deleteMany: jest.fn(),
        }
    },
}));

describe('Role Controller', () => {
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

    describe('getAllRoles', () => {
        it('should return all roles', async () => {
            const mockRoles = [{ id: '1', name: 'Admin' }];
            (prisma.role.findMany as jest.Mock).mockResolvedValue(mockRoles);

            await getAllRoles(mockRequest as any, mockResponse as Response, nextFunction);

            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockRoles
            }));
        });
    });

    describe('createRole', () => {
        it('should create role successfully', async () => {
            const mockRole = { id: '1', name: 'New Role', code: 'NEW' };
            mockRequest.body = { name: 'New Role', code: 'NEW' };

            (prisma.role.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.role.create as jest.Mock).mockResolvedValue(mockRole);

            await createRole(mockRequest as any, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockRole
            }));
        });
    });

    describe('deleteRole', () => {
        it('should delete role if no users attached', async () => {
            mockRequest.params = { id: '1' };
            (prisma.user.count as jest.Mock).mockResolvedValue(0);
            (prisma.role.delete as jest.Mock).mockResolvedValue({ id: '1' });

            await deleteRole(mockRequest as any, mockResponse as Response, nextFunction);

            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true
            }));
        });

        it('should fail if users are attached', async () => {
            mockRequest.params = { id: '1' };
            (prisma.user.count as jest.Mock).mockResolvedValue(5);

            await deleteRole(mockRequest as any, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 400
            }));
        });
    });
});
