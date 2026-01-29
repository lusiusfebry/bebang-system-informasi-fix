export const PERMISSIONS = {
    // Employee
    EMPLOYEE_READ: 'employee.read',
    EMPLOYEE_CREATE: 'employee.create',
    EMPLOYEE_UPDATE: 'employee.update',
    EMPLOYEE_DELETE: 'employee.delete',
    EMPLOYEE_EXPORT: 'employee.export',
    EMPLOYEE_IMPORT: 'employee.import',

    // HR Master Data
    HR_MASTER_READ: 'hr_master.read',
    HR_MASTER_CREATE: 'hr_master.create',
    HR_MASTER_UPDATE: 'hr_master.update',
    HR_MASTER_DELETE: 'hr_master.delete',

    // User Management
    USER_READ: 'user.read',
    USER_CREATE: 'user.create',
    USER_UPDATE: 'user.update',
    USER_DELETE: 'user.delete',

    // Role Management
    ROLE_READ: 'role.read',
    ROLE_CREATE: 'role.create',
    ROLE_UPDATE: 'role.update',
    ROLE_DELETE: 'role.delete',
    ROLE_ASSIGN_PERMISSIONS: 'role.assign_permissions',

    // Resignation
    RESIGNATION_READ: 'resignation.read',
    RESIGNATION_CREATE: 'resignation.create',
    RESIGNATION_APPROVE: 'resignation.approve', // Includes reject
    RESIGNATION_DELETE: 'resignation.delete',
} as const;

export type PermissionString = typeof PERMISSIONS[keyof typeof PERMISSIONS];
