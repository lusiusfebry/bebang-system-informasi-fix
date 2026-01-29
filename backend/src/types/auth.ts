import { Request } from 'express';


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
/**
 * User data without password (safe to return to client)
 */
export interface SafeUser {
    id: string;
    nik: string;
    email: string | null;
    fullName: string;
    roleId: string | null;
    role: {
        id: string;
        name: string;
        code: string;
        description: string | null;
    } | null;
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
    roleId: string;
    roleCode: string;
    permissions: string[]; // Array of permission names
    iat?: number;
    exp?: number;
}

/**
 * Authenticated request with user data
 */
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
