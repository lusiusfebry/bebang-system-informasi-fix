import { Request, Response } from 'express';
import { resignationService } from '../services/resignation.service';
import { ResignationStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../types/auth';

export class ResignationController {

    async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const result = await resignationService.create(data);
            res.status(201).json({
                success: true,
                message: 'Resignation request submitted successfully',
                data: result
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create resignation request'
            });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const { page, limit, status, search } = req.query;
            const result = await resignationService.findAll({
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
                status: status as ResignationStatus,
                search: search as string
            });
            res.status(200).json({
                success: true,
                data: result.data,
                meta: result.meta
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch resignations'
            });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await resignationService.findById(id);
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Resignation not found'
                });
            }
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async approve(req: Request, res: Response) {
        const authReq = req as AuthenticatedRequest;
        try {
            const { id } = req.params;
            const userId = authReq.user?.userId;

            const result = await resignationService.updateStatus(
                id,
                ResignationStatus.APPROVED,
                userId
            );

            res.status(200).json({
                success: true,
                message: 'Resignation approved and employee status updated',
                data: result
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async reject(req: Request, res: Response) {
        const authReq = req as AuthenticatedRequest;
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const userId = authReq.user?.userId;

            const result = await resignationService.updateStatus(
                id,
                ResignationStatus.REJECTED,
                userId,
                reason
            );

            res.status(200).json({
                success: true,
                message: 'Resignation rejected',
                data: result
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

export const resignationController = new ResignationController();
