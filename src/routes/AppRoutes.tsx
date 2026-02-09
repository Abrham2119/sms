import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';


import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { SuppliersPage } from "../features/suppliers/SuppliersPage";
import { RequestsPage } from "../features/requests/RequestsPage";
import { AdminsPage } from "../features/admins/AdminsPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import { UsersPage } from "../features/users/UsersPage";
import { RolesPage } from "../features/roles/RolesPage";
import { PermissionsPage } from "../features/permissions/PermissionsPage";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes - Redirect to Dashboard if logged in */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<AuthLayout />}>
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    {/* Main Dashboard Route */}
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* Example mapping - adjust as per actual role names */}
                    <Route path="/suppliers" element={<SuppliersPage />} />
                    <Route path="/requests" element={<RequestsPage />} />

                    {/* Root redirect - Redirect to Dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'Super_Admin']} />}>
                <Route element={<MainLayout />}>
                    <Route path="/admins" element={<AdminsPage />} />

                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/roles" element={<RolesPage />} />
                    <Route path="/permissions" element={<PermissionsPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
