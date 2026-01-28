import { Request } from 'express';
import { Role } from '@prisma/client';

/**
 * Login request body
 */
export interface LoginRequest {
    nik: string;
    password: string;
}

/**
 * User data without password (safe to return to client)
 */
export interface SafeUser {
    id: string;
    nik: string;
    email: string | null;
    fullName: string;
    role: Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Login response
 */
export interface LoginResponse {
    token: string;
    user: SafeUser;
}

/**
 * JWT payload structure
 */
export interface JwtPayload {
    userId: string;
    nik: string;
    role: Role;
    iat?: number;
    exp?: number;
}

/**
 * Authenticated request with user data
 */
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
