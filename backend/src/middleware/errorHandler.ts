import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const isOperational = err.isOperational || false;

    // Log error using Winston
    logger.error('🚨 Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        statusCode,
    });

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && !isOperational && { stack: err.stack }),
        },
    });
}

// Custom error class
export class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Not found handler
export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.path} not found`,
        },
    });
}
