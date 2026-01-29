import { Response, NextFunction } from 'express';

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
 * Authorization middleware factory - Role-based
 * Checks if user has one of the allowed role codes
 */
export function authorizeRoles(...allowedRoleCodes: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new ApiError('User tidak terautentikasi', 401));
            return;
        }

        if (!allowedRoleCodes.includes(req.user.roleCode)) {
            next(new ApiError('Akses ditolak. Anda tidak memiliki role yang sesuai.', 403));
            return;
        }

        next();
    };
}

/**
 * Authorization middleware factory - Permission-based
 * Checks if user has ALL required permissions
 */
export function requirePermissions(...requiredPermissions: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new ApiError('User tidak terautentikasi', 401));
            return;
        }

        const userPermissions = req.user.permissions || [];

        // Check if user has all required permissions
        const hasAllPermissions = requiredPermissions.every(perm =>
            userPermissions.includes(perm)
        );

        if (!hasAllPermissions) {
            next(new ApiError('Akses ditolak. Anda tidak memiliki izin yang diperlukan.', 403));
            return;
        }

        next();
    };
}

/**
 * Authorization middleware factory - Permission-based (ANY)
 * Checks if user has ANY of the required permissions
 */
export function requireAnyPermission(...requiredPermissions: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new ApiError('User tidak terautentikasi', 401));
            return;
        }

        const userPermissions = req.user.permissions || [];

        // Check if user has at least one required permission
        const hasAnyPermission = requiredPermissions.some(perm =>
            userPermissions.includes(perm)
        );

        if (!hasAnyPermission) {
            next(new ApiError('Akses ditolak. Anda tidak memiliki izin yang diperlukan.', 403));
            return;
        }

        next();
    };
}
