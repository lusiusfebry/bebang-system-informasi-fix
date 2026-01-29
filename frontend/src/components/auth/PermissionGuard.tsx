import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PermissionString } from '../../constants/permissions';

interface PermissionGuardProps {
    children: ReactNode;
    permission?: PermissionString | PermissionString[];
    requireAll?: boolean;
    fallback?: ReactNode;
}

export function PermissionGuard({
    children,
    permission,
    requireAll = false,
    fallback = null,
}: PermissionGuardProps) {
    const { user } = useAuth();

    if (!user) {
        return <>{fallback}</>;
    }

    // Admin bypass (optional - currently using permission based check for everything)
    if (user.roleCode === 'ADMIN') {
        return <>{children}</>;
    }

    if (!permission) {
        return <>{children}</>;
    }

    const userPermissions = user.permissions || [];
    const requiredPermissions = Array.isArray(permission) ? permission : [permission];

    const hasPermission = requireAll
        ? requiredPermissions.every(p => userPermissions.includes(p))
        : requiredPermissions.some(p => userPermissions.includes(p));

    if (hasPermission) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
