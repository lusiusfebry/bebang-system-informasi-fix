import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { ApiError } from '../middleware/errorHandler';
import { prisma } from '../config/database';

export async function getAllRoles(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const roles = await prisma.role.findMany({
            include: {
                _count: {
                    select: { users: true, rolePermissions: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        res.json({
            success: true,
            data: roles
        });
    } catch (error) {
        next(error);
    }
}

export async function getRoleById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;

        const role = await prisma.role.findUnique({
            where: { id },
            include: {
                rolePermissions: {
                    include: {
                        permission: true
                    }
                },
                _count: {
                    select: { users: true }
                }
            }
        });

        if (!role) {
            throw new ApiError('Role tidak ditemukan', 404);
        }

        res.json({
            success: true,
            data: role
        });
    } catch (error) {
        next(error);
    }
}

export async function createRole(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { name, code, description } = req.body;

        // Validate required fields
        if (!name || !code) {
            throw new ApiError('Nama dan kode role wajib diisi', 400);
        }

        // Check if code already exists
        const existing = await prisma.role.findUnique({ where: { code } });
        if (existing) {
            throw new ApiError('Kode role sudah digunakan', 400);
        }

        const role = await prisma.role.create({
            data: { name, code, description }
        });

        res.status(201).json({
            success: true,
            message: 'Role berhasil dibuat',
            data: role
        });
    } catch (error) {
        next(error);
    }
}

export async function updateRole(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;

        const role = await prisma.role.update({
            where: { id },
            data: { name, description, isActive }
        });

        res.json({
            success: true,
            message: 'Role berhasil diupdate',
            data: role
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteRole(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;

        // Check if role has users
        const usersCount = await prisma.user.count({ where: { roleId: id } });
        if (usersCount > 0) {
            throw new ApiError('Tidak dapat menghapus role yang masih digunakan oleh user', 400);
        }

        await prisma.role.delete({ where: { id } });

        res.json({
            success: true,
            message: 'Role berhasil dihapus'
        });
    } catch (error) {
        next(error);
    }
}

export async function getRolePermissions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;

        const rolePermissions = await prisma.rolePermission.findMany({
            where: { roleId: id },
            include: { permission: true }
        });

        res.json({
            success: true,
            data: rolePermissions.map(rp => rp.permission)
        });
    } catch (error) {
        next(error);
    }
}

export async function assignPermissionsToRole(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const { permissionIds } = req.body;

        if (!Array.isArray(permissionIds)) {
            throw new ApiError('permissionIds harus berupa array', 400);
        }

        // Delete existing permissions
        await prisma.rolePermission.deleteMany({ where: { roleId: id } });

        // Create new permissions
        const rolePermissions = permissionIds.map(permissionId => ({
            roleId: id,
            permissionId
        }));

        await prisma.rolePermission.createMany({ data: rolePermissions });

        res.json({
            success: true,
            message: 'Permissions berhasil diassign ke role'
        });
    } catch (error) {
        next(error);
    }
}
