import jwt, { Secret } from 'jsonwebtoken';
import { JwtPayload } from '../types/auth';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'default-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate a JWT token for the given payload
 * Note: Payload should include permissions array
 */
export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT token
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): JwtPayload {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token sudah kadaluarsa');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Token tidak valid');
        }
        throw error;
    }
}

/**
 * Decode a JWT token without verifying (for debugging)
 */
export function decodeToken(token: string): JwtPayload | null {
    try {
        return jwt.decode(token) as JwtPayload;
    } catch {
        return null;
    }
}
