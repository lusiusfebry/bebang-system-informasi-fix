import { Request, Response } from 'express';
import { login, getProfile, logout, getPermissions } from '../../controllers/auth.controller';
import { prisma } from '../../config/database';
import bcrypt from 'bcrypt';
import * as jwt from '../../utils/jwt';

// Mock dependencies
jest.mock('../../config/database', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));

jest.mock('bcrypt');
jest.mock('../../utils/jwt');

describe('Auth Controller', () => {
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

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            const mockUser = {
                id: '1',
                nik: '12345',
                password: 'hashedPassword',
                isActive: true,
                role: {
                    code: 'ADMIN',
                    rolePermissions: []
                }
            };

            mockRequest.body = { nik: '12345', password: 'password' };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.generateToken as jest.Mock).mockReturnValue('mock-token');

            await login(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: expect.objectContaining({
                    token: 'mock-token',
                    user: expect.objectContaining({ nik: '12345' })
                })
            }));
        });

        it('should fail with invalid credentials', async () => {
            const mockUser = {
                id: '1',
                nik: '12345',
                password: 'hashedPassword',
                isActive: true
            };

            mockRequest.body = { nik: '12345', password: 'wrongpassword' };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await login(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({
                message: 'NIK atau password salah',
                statusCode: 401
            }));
        });
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            const mockUser = {
                id: '1',
                nik: '12345',
                isActive: true,
                role: { code: 'ADMIN' }
            };

            (mockRequest as any).user = { userId: '1', nik: '12345', roleId: 'role-1', roleCode: 'ADMIN', permissions: [] };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

            await getProfile(mockRequest as any, mockResponse as Response, nextFunction);

            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: expect.objectContaining({ nik: '12345' })
            }));
        });
    });

    describe('getPermissions', () => {
        it('should return user permissions', async () => {
            (mockRequest as any).user = {
                userId: '1',
                nik: '12345',
                roleId: 'role-1',
                roleCode: 'ADMIN',
                permissions: ['employee.read']
            };

            await getPermissions(mockRequest as any, mockResponse as Response, nextFunction);

            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: expect.objectContaining({
                    permissions: ['employee.read'],
                    roleCode: 'ADMIN'
                })
            }));
        });
    });

    describe('logout', () => {
        it('should logout successfully', async () => {
            await logout(mockRequest as any, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true
            }));
        });
    });
});
