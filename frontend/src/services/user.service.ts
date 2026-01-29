
import api, { PaginatedResponse } from './api';
import { Role } from '../types/auth'; // Re-use types

export interface SimpleUser {
    id: string;
    fullName: string;
    email: string | null;
    role: Role;
    isActive: boolean;
    createdAt: string;
    lastLogin: string | null;
}

export interface UserFilterState {
    search?: string;
    roleId?: string;
    isActive?: boolean | string; // 'true'/'false' from select
}

export interface AssignRoleInput {
    roleId: string;
}

export const userService = {
    getUsers: async (params: { page: number; limit: number; search?: string; roleId?: string }) => {
        // Build query string manually or use axios params
        // backend expects: GET /users?page=1&limit=10&search=...&roleId=...
        const response = await api.get<PaginatedResponse<SimpleUser>>('/users', { params });
        return response.data;
    },

    getUser: async (id: string) => {
        const response = await api.get<{ success: boolean; data: SimpleUser }>(`/users/${id}`);
        return response.data;
    },

    assignRole: async (userId: string, roleId: string) => {
        const response = await api.post<{ success: boolean; data: SimpleUser }>(`/users/${userId}/role`, { roleId });
        return response.data;
    }
};
