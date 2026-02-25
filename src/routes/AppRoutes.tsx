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
import { UserDetailPage } from "../features/users/UserDetailPage";
import { RolesPage } from "../features/roles/RolesPage";
import { PermissionsPage } from "../features/permissions/PermissionsPage";
import CategoriesPage from "../features/categories/CategoriesPage";
import ProductsPage from "../features/products/ProductsPage";
import { ProductDetailPage } from "../features/products/ProductDetailPage";
import SupplierProductsPage from "../features/suppliers/SupplierProductsPage";
import { SupplierDetailPage } from "../features/suppliers/SupplierDetailPage";
import MyProductsPage from "../features/suppliers/MyProductsPage";
import { MyProductDetailPage } from "../features/suppliers/MyProductDetailPage";
import LinkedProductsPage from "../features/suppliers/LinkedProductsPage";
import ProfilePage from "../features/suppliers/ProfilePage";
import { RFQsPage } from "../features/rfqs/RFQsPage";
import { RFQDetailPage } from "../features/rfqs/RFQDetailPage";
import { SupplierRFQsPage } from "../features/rfqs/SupplierRFQsPage";
import { RFQQuotationsPage } from '../features/rfqs/RFQQuotationsPage';
// import { EvaluationsListPage } from '../features/rfqs/EvaluationsListPage';
import { ShortlistedEvaluationsPage } from '../features/rfqs/ShortlistedEvaluationsPage';

const AppRoutes = () => {
    return (
        <Routes>

            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<AuthLayout />}>
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
            </Route>


            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>

                    <Route path="/dashboard" element={<DashboardPage />} />


                    <Route path="/suppliers" element={<SuppliersPage />} />
                    <Route path="/suppliers/:id" element={<SupplierDetailPage />} />
                    <Route path="/suppliers/link/:id" element={<SupplierProductsPage />} />
                    <Route path="/requests" element={<RequestsPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/suppliers/:id/products" element={<SupplierProductsPage />} />
                    <Route path="/my-products" element={<MyProductsPage />} />
                    <Route path="/my-products/:id" element={<MyProductDetailPage />} />
                    <Route path="/linked-products" element={<LinkedProductsPage />} />
                    <Route path="/my-profile" element={<ProfilePage />} />

                    {/* RFQ Routes */}
                    <Route path="/admin/rfqs" element={<RFQsPage />} />
                    <Route path="/admin/rfqs/:id" element={<RFQDetailPage />} />
                    <Route path="/admin/rfqs/:id/quotations" element={<RFQQuotationsPage />} />
                    {/* <Route path="/admin/evaluations/:id" element={<EvaluationsListPage />} /> */}
                    <Route path="/admin/evaluations/:id/shortlisted" element={<ShortlistedEvaluationsPage />} />
                    <Route path="/supplier/rfqs" element={<SupplierRFQsPage />} />


                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Route>


            <Route element={<ProtectedRoute allowedRoles={['admin', 'Super_Admin']} />}>
                <Route element={<MainLayout />}>
                    <Route path="/admins" element={<AdminsPage />} />

                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/users/:id" element={<UserDetailPage />} />
                    <Route path="/roles" element={<RolesPage />} />
                    <Route path="/permissions" element={<PermissionsPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
