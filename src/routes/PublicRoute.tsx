import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getRoleRedirectPath } from '../utils/roleRedirect';

export const PublicRoute = () => {
    const { isAuthenticated, roles } = useAuthStore();

    if (isAuthenticated) {
        // Redirect to first role's name or default
        // The prompt says: "if primary role is Super_Admin; use the first role's name if multiple"
        // Also ensure role name is URL safe if needed, assuming they are clean strings like "Super_Admin"
        const redirectPath = getRoleRedirectPath(roles);
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};
