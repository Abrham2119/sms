import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getRoleRedirectPath } from '../utils/roleRedirect';

export const PublicRoute = () => {
    const { isAuthenticated, roles } = useAuthStore();

    if (isAuthenticated) {

        const redirectPath = getRoleRedirectPath(roles);
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};
