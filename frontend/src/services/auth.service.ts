import api from './api';
import { User, LoginResponse, AuthResponse } from '../types/auth';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/**
 * Login with NIK and password
 */
export async function login(nik: string, password: string): Promise<LoginResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { nik, password });

    if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;

        // Store token and user in localStorage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        return { token, user };
    }

    throw new Error(response.data.error?.message || 'Login gagal');
}

/**
 * Logout - remove token and user from localStorage
 */
export function logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/login';
}

/**
 * Get user profile from API
 */
export async function getProfile(): Promise<User> {
    const response = await api.get<{ success: boolean; data?: User }>('/auth/profile');

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error('Failed to get profile');
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
        try {
            return JSON.parse(userStr) as User;
        } catch {
            return null;
        }
    }
    return null;
}

/**
 * Get token from localStorage
 */
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    const token = getToken();
    return !!token;
}
