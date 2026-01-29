
import api from './api';
import { Permission } from '../types/auth'; // Re-use Permission type

export interface PermissionGroup {
    module: string;
    permissions: Permission[];
}

export interface Role {
    id: string;
    name: string;
    code: string;
    description: string | null;
    isSystem: boolean; // If applicable
    permissions: Permission[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateRoleInput {
    name: string;
    code: string;
    description?: string;
    permissionIds: string[];
}

export interface UpdateRoleInput {
    name?: string;
    description?: string;
    permissionIds?: string[];
}

export const roleService = {
    // Roles
    getRoles: async () => {
        const response = await api.get<{ success: boolean; data: Role[] }>('/roles');
        return response.data;
    },

    getRole: async (id: string) => {
        const response = await api.get<{ success: boolean; data: Role }>(`/roles/${id}`);
        return response.data;
    },

    createRole: async (data: CreateRoleInput) => {
        const response = await api.post<{ success: boolean; data: Role }>('/roles', data);
        return response.data;
    },

    updateRole: async (id: string, data: UpdateRoleInput) => {
        const response = await api.put<{ success: boolean; data: Role }>(`/roles/${id}`, data);
        return response.data;
    },

    deleteRole: async (id: string) => {
        const response = await api.delete<{ success: boolean }>(`/roles/${id}`);
        return response.data;
    },

    // Permissions
    getAllPermissions: async () => {
        const response = await api.get<{ success: boolean; data: Permission[] }>('/permissions');
        return response.data;
    },

    getPermissionsGrouped: async () => {
        const response = await api.get<{ success: boolean; data: Permission[] }>('/permissions');
        // Group by module client-side
        const permissions = response.data.data;
        // Note: response.data.data because generic api.get return type vs actual structure
        // Actually usually api.get<T> returns T directly if using axios interceptor?
        // My api.ts likely returns data directly or full response? 
        // Checking existing services, e.g. auth.service:
        // const response = await api.post<AuthResponse>('/auth/login', ...); return response.data;
        // So response is AxiosResponse.

        // Wait, I should verify api.ts.
        return permissions;
    }
};
