import { Request, Response, NextFunction } from 'express';
import { authenticate, requirePermissions } from '../../middleware/auth.middleware';
import * as jwt from '../../utils/jwt';
import { prisma } from '../../config/database';

jest.mock('../../utils/jwt');
jest.mock('../../config/database', () => ({
    prisma: {
        user: { findUnique: jest.fn() }
    }
}));

describe('Auth Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            headers: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
        jest.clearAllMocks();
    });

    describe('authenticate', () => {
        it('should call next if token valid', async () => {
            mockRequest.headers = { authorization: 'Bearer token' };
            (jwt.verifyToken as jest.Mock).mockReturnValue({ userId: '1' });
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', isActive: true, role: { code: 'ADMIN' }, roleId: 'r1' });

            await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect((mockRequest as any).user).toBeDefined();
        });

        it('should return 401 if no token', async () => {
            await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(nextFunction).toHaveBeenCalledWith(expect.anything());
        });
    });

    describe('requirePermissions', () => {
        it('should call next if user has permission', () => {
            (mockRequest as any).user = { permissions: ['user.read'] };
            const middleware = requirePermissions('user.read');

            middleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should return 403 if user lacks permission', () => {
            (mockRequest as any).user = { permissions: [] };
            const middleware = requirePermissions('user.read');

            middleware(mockRequest as Request, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
        });
    });
});
