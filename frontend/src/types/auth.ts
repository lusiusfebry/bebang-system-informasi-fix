export interface Permission {
    id: string;
    name: string;
    description: string | null;
    module: string;
}

export interface Role {
    id: string;
    name: string;
    code: string;
    description: string | null;
    permissions: Permission[];
}

export interface User {
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
    // Helper property for easier access (flattened permissions)
    permissions: string[];
    roleCode: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface AuthResponse {
    success: boolean;
    data?: LoginResponse;
    message?: string;
    error?: {
        message: string;
    };
}
