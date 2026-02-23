import { Activity, ArrowLeft, FileText, Package, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ActivityLog } from '../../components/common/ActivityLog';
import { DataTable } from '../../components/table/DataTable';
import type { Column } from '../../components/table/DataTable';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import type { Product, Supplier, Role } from '../../types';
import { useProduct, useProductSuppliers } from './hooks/useProduct';

// Tab Components
const ProductInfoTab = ({ product }: { product: Product }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Product Specification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</label>
                    <p className="font-medium text-gray-900 dark:text-white mt-1">{product.name}</p>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
                    <p className="font-medium text-gray-900 dark:text-white mt-1">{product.category?.name || 'Uncategorized'}</p>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                    <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${product.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        {product.description || 'No description provided.'}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const ProductSuppliersTab = ({ productId }: { productId: string }) => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const { data: suppliersData, isLoading } = useProductSuppliers(productId, { page, per_page: perPage });

    const columns: Column<Supplier>[] = [
        {
            key: 'legal_name',
            label: 'Supplier Name',
            render: (s) => (
                <div className="font-medium text-gray-900 dark:text-white">{s.legal_name}</div>
            )
        },
        {
            key: 'trade_name',
            label: 'Trade Name',
            render: (s) => s.trade_name
        },
        {
            key: 'email',
            label: 'Email',
            render: (s) => s.email
        },
        {
            key: 'status',
            label: 'Status',
            render: (s) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${s.status === 'active' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                    {s.status}
                </span>
            )
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Linked Suppliers</h3>
                <p className="text-sm text-gray-500">List of suppliers providing this product.</p>
            </div>
            <div className="p-6">
                <DataTable
                    data={suppliersData?.data || []}
                    columns={columns}
                    loading={isLoading}
                    serverSide
                    totalItems={suppliersData?.total || 0}
                    currentPage={page}
                    itemsPerPage={perPage}
                    onPageChange={setPage}
                    onItemsPerPageChange={setPerPage}
                    searchPlaceholder="Search suppliers..."
                />
            </div>
        </div>
    );
};

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const { roles } = useAuthStore();
    const isAdmin = roles.some((r: Role) => ['admin', 'Super_Admin'].includes(r.name));

    const { data: product, isLoading } = useProduct(id!);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading product details...</div>;
    }

    if (!product) {
        return <div className="p-8 text-center text-red-500">Product not found.</div>;
    }

    const tabs = [
        { id: 'info', label: 'Info', icon: FileText },
        { id: 'logs', label: 'Logs', icon: Activity },
    ];

    if (isAdmin) {
        tabs.push({ id: 'suppliers', label: 'Suppliers', icon: Users });
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-12">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/products')}
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white -ml-2 mb-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
                        </Button>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-200 dark:shadow-none">
                                    {product.name.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Package className="w-3 h-3" /> {product.category?.name || 'Uncategorized'}
                                        </span>
                                        <span>•</span>
                                        <span className={`capitalize ${product.is_active ? 'text-green-600 font-medium' : 'text-gray-500'}`}>{product.is_active ? 'Active' : 'Inactive'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-6 border-b border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-hide">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 pb-3 text-sm font-medium transition-all relative
                                        ${isActive
                                            ? 'text-primary-600 dark:text-primary-400'
                                            : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
                {activeTab === 'info' && <ProductInfoTab product={product} />}
                {activeTab === 'logs' && <ActivityLog entityType="product" entityId={id!} />}
                {activeTab === 'suppliers' && isAdmin && <ProductSuppliersTab productId={id!} />}
            </div>
        </div>
    );
};
