import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../config/database';
import { verifyToken } from '../utils/jwt';
import { ApiError } from './errorHandler';
import { AuthenticatedRequest } from '../types/auth';

/**
 * Authentication middleware
 * Validates JWT token and attaches user to request
 */
export function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError('Token tidak ditemukan', 401);
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        if (!token) {
            throw new ApiError('Token tidak ditemukan', 401);
        }

        // Verify token
        const payload = verifyToken(token);

        // Attach user payload to request
        req.user = payload;

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else if (error instanceof Error) {
            next(new ApiError(error.message || 'Token tidak valid atau sudah kadaluarsa', 401));
        } else {
            next(new ApiError('Token tidak valid atau sudah kadaluarsa', 401));
        }
    }
}

/**
 * Authentication middleware with user validation
 * Validates JWT token AND verifies user still exists and is active
 */
export async function authenticateAndValidate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // First authenticate the token
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError('Token tidak ditemukan', 401);
        }

        const token = authHeader.substring(7);

        if (!token) {
            throw new ApiError('Token tidak ditemukan', 401);
        }

        // Verify token
        const payload = verifyToken(token);

        // Verify user still exists and is active
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, isActive: true },
        });

        if (!user) {
            throw new ApiError('User tidak ditemukan', 401);
        }

        if (!user.isActive) {
            throw new ApiError('Akun tidak aktif', 401);
        }

        // Attach user payload to request
        req.user = payload;

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else if (error instanceof Error) {
            next(new ApiError(error.message || 'Token tidak valid atau sudah kadaluarsa', 401));
        } else {
            next(new ApiError('Token tidak valid atau sudah kadaluarsa', 401));
        }
    }
}

/**
 * Authorization middleware factory
 * Checks if user has one of the allowed roles
 */
export function authorize(...allowedRoles: Role[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new ApiError('User tidak terautentikasi', 401));
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            next(new ApiError('Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.', 403));
            return;
        }

        next();
    };
}
