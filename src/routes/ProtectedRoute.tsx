import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, roles } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && roles.length > 0) {
        // Check if user has any of the allowed roles by name
        const hasAllowedRole = roles.some(role => allowedRoles.includes(role.name));

        if (!hasAllowedRole) {
            // Redirect to the first available role's dashboard or a default
            const homeRole = roles[0].name;
            return <Navigate to={`/${homeRole}`} replace />;
        }
    }

    return <Outlet />;
};
