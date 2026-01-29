import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { ApiError } from '../middleware/errorHandler';
import { prisma } from '../config/database';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const where = search ? {
            OR: [
                { nik: { contains: String(search), mode: 'insensitive' as const } },
                { fullName: { contains: String(search), mode: 'insensitive' as const } },
                { email: { contains: String(search), mode: 'insensitive' as const } },
            ]
        } : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: { role: true },
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        // Remove passwords
        const safeUsers = users.map(({ password, ...user }) => user);

        res.json({
            success: true,
            data: safeUsers,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: { role: true }
        });

        if (!user) {
            throw new ApiError('User tidak ditemukan', 404);
        }

        const { password, ...safeUser } = user;

        res.json({
            success: true,
            data: safeUser
        });
    } catch (error) {
        next(error);
    }
}

export async function createUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { nik, email, password, fullName, roleId } = req.body;

        if (!nik || !password || !fullName) {
            throw new ApiError('NIK, password, dan nama lengkap wajib diisi', 400);
        }

        // Check if NIK already exists
        const existing = await prisma.user.findUnique({ where: { nik } });
        if (existing) {
            throw new ApiError('NIK sudah terdaftar', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                nik,
                email,
                password: hashedPassword,
                fullName,
                roleId
            },
            include: { role: true }
        });

        const { password: _, ...safeUser } = user;

        res.status(201).json({
            success: true,
            message: 'User berhasil dibuat',
            data: safeUser
        });
    } catch (error) {
        next(error);
    }
}

export async function updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const { email, fullName, isActive, roleId } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { email, fullName, isActive, roleId },
            include: { role: true }
        });

        const { password, ...safeUser } = user;

        res.json({
            success: true,
            message: 'User berhasil diupdate',
            data: safeUser
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;

        // Prevent deleting own account
        if (req.user?.userId === id) {
            throw new ApiError('Tidak dapat menghapus akun sendiri', 400);
        }

        await prisma.user.delete({ where: { id } });

        res.json({
            success: true,
            message: 'User berhasil dihapus'
        });
    } catch (error) {
        next(error);
    }
}

export async function assignRoleToUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const { roleId } = req.body;

        if (!roleId) {
            throw new ApiError('roleId wajib diisi', 400);
        }

        const user = await prisma.user.update({
            where: { id },
            data: { roleId },
            include: { role: true }
        });

        const { password, ...safeUser } = user;

        res.json({
            success: true,
            message: 'Role berhasil diassign ke user',
            data: safeUser
        });
    } catch (error) {
        next(error);
    }
}
