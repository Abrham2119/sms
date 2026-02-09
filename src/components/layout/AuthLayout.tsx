import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.ts';

export const AuthLayout = () => {
    const { isAuthenticated } = useAuthStore();
    if (isAuthenticated) {
        return <Navigate to="/suppliers" replace />;
    }
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Outlet />
            </div>
        </div>
    );
};
