import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { Permission } from '../../types';

interface PermissionGuardProps {
    children: ReactNode;
    requiredPermission: Permission;
    redirectTo?: string;
}

export const PermissionGuard = ({
    children,
    requiredPermission,
    redirectTo = '/dashboard'
}: PermissionGuardProps) => {
    const { hasPermission } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasPermission(requiredPermission)) {
            navigate(redirectTo, { replace: true });
        }
    }, [hasPermission, requiredPermission, redirectTo, navigate]);

    if (!hasPermission(requiredPermission)) {
        return null;
    }

    return <>{children}</>;
};
