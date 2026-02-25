import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, roles } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/Login" state={{ from: location }} replace />;
    }

    if (allowedRoles && roles.length > 0) {

        const hasAllowedRole = roles.some(role => allowedRoles.includes(role.name));

        if (!hasAllowedRole) {

            const homeRole = roles[0].name;
            return <Navigate to={`/${homeRole}`} replace />;
        }
    }

    return <Outlet />;
};
