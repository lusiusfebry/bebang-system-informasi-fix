import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { prisma } from '../config/database';

export async function getAllPermissions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const permissions = await prisma.permission.findMany({
            orderBy: [{ module: 'asc' }, { name: 'asc' }]
        });

        res.json({
            success: true,
            data: permissions
        });
    } catch (error) {
        next(error);
    }
}

export async function getPermissionsByModule(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { module } = req.params;

        const permissions = await prisma.permission.findMany({
            where: { module },
            orderBy: { name: 'asc' }
        });

        res.json({
            success: true,
            data: permissions
        });
    } catch (error) {
        next(error);
    }
}
