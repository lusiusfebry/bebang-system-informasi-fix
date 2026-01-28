import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../config/database';
import { generateToken } from '../utils/jwt';
import { LoginRequest, SafeUser } from '../types/auth';
import { ApiError } from '../middleware/errorHandler';
import { successResponse } from '../utils/response';
import { AuthenticatedRequest } from '../types/auth';

// Validation schema for login
const loginSchema = z.object({
    nik: z.string().min(1, 'NIK wajib diisi'),
    password: z.string().min(1, 'Password wajib diisi'),
});

/**
 * Remove password from user object
 */
function excludePassword(user: {
    id: string;
    nik: string;
    email: string | null;
    password: string;
    fullName: string;
    role: 'ADMIN' | 'USER' | 'HR_MANAGER' | 'VIEWER';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}): SafeUser {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

/**
 * Login handler
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // Validate input
        const validationResult = loginSchema.safeParse(req.body);
        if (!validationResult.success) {
            throw new ApiError(validationResult.error.errors[0].message, 400);
        }

        const { nik, password }: LoginRequest = validationResult.data;

        // Find user by NIK
        const user = await prisma.user.findUnique({
            where: { nik },
        });

        if (!user) {
            throw new ApiError('NIK atau password salah', 401);
        }

        // Check if user is active
        if (!user.isActive) {
            throw new ApiError('Akun tidak aktif. Hubungi administrator.', 403);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError('NIK atau password salah', 401);
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            nik: user.nik,
            role: user.role,
        });

        // Return token and user data (without password)
        const safeUser = excludePassword(user);

        res.json(successResponse({ token, user: safeUser }, 'Login berhasil'));
    } catch (error) {
        next(error);
    }
}

/**
 * Get current user profile
 * GET /api/auth/profile
 */
export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) {
            throw new ApiError('User tidak ditemukan', 401);
        }

        // Get fresh user data from database
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });

        if (!user) {
            throw new ApiError('User tidak ditemukan', 404);
        }

        if (!user.isActive) {
            throw new ApiError('Akun tidak aktif', 403);
        }

        const safeUser = excludePassword(user);
        res.json(successResponse(safeUser));
    } catch (error) {
        next(error);
    }
}

/**
 * Logout handler (optional - mainly for logging/audit)
 * POST /api/auth/logout
 */
export async function logout(_req: AuthenticatedRequest, res: Response): Promise<void> {
    // Token invalidation would require a blacklist/redis implementation
    // For now, client just removes the token from localStorage
    res.json(successResponse(null, 'Logout berhasil'));
}
