import { Request, Response } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../../controllers/user.controller';
import { prisma } from '../../config/database';
import bcrypt from 'bcrypt';

// Mock dependencies
jest.mock('../../config/database', () => ({
    prisma: {
        user: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
    },
}));

jest.mock('bcrypt');

describe('User Controller', () => {
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

    describe('getAllUsers', () => {
        it('should return users list', async () => {
            mockRequest.query = { page: '1', limit: '10' };
            (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.user.count as jest.Mock).mockResolvedValue(0);

            await getAllUsers(mockRequest as any, mockResponse as Response, nextFunction);

            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: []
            }));
        });
    });

    describe('createUser', () => {
        it('should create user successfully', async () => {
            const mockUser = { id: '1', nik: '123' };
            mockRequest.body = { nik: '123', password: 'pass', fullName: 'Test' };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
            (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

            await createUser(mockRequest as any, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockUser
            }));
        });
    });
});
