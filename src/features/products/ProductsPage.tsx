import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PermissionGuard } from "../../components/guards/PermissionGuard";
import type { Product } from "../../types";
import { PERMISSIONS } from "../../types";
import {
    useCreateProduct,
    useDeleteProduct,
    useProducts,
    useUpdateProduct,
} from "./hooks/useProduct";
// We need categories for the dropdown in the form
import { Edit2, Eye, Trash2 } from "lucide-react";
import type { Column } from "../../components/table/DataTable";
import { DataTable } from "../../components/table/DataTable";
import { Button } from "../../components/ui/Button";
import { useCategories } from "../categories/hooks/useCategory";
import { ProductFormDialog } from "./components/ProductFormDialog";

import { ConfirmDialog } from "../../components/ui/ConfirmDialog";

const ProductsPageContent = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortBy, setSortBy] = useState<string | undefined>();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();
    const navigate = useNavigate();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: productsData, isLoading } = useProducts({
        page,
        per_page: perPage,
        search: debouncedSearch,
        sort_by: sortBy,
        sort_order: sortOrder
    });
    const products = productsData?.data || [];

    const columns: Column<Product>[] = [
        { key: 'name', label: 'Name', sortable: true, searchable: true },
        {
            key: 'category',
            label: 'Category',
            render: (p) => p.category?.name || '-'
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (p) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                    {p.is_active ? "Active" : "Inactive"}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (p) => (
                <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/products/${p.id}`)}>
                        <Eye className="w-4 h-4 text-primary-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setFormState({ open: true, data: p })}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                        onClick={() => setDeleteId(p.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    // Fetch categories for the form
    const { data: categoriesData } = useCategories({ per_page: 100 });
    const categories = categoriesData?.data || [];

    const [formState, setFormState] = useState<{
        open: boolean;
        data: Product | null;
    }>({ open: false, data: null });

    const createMut = useCreateProduct();
    const updateMut = useUpdateProduct();
    const deleteMut = useDeleteProduct();

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleCreate = async (data: any) => {
        await createMut.mutateAsync(data);
    };

    const handleUpdate = async (data: any) => {
        if (formState.data) {
            await updateMut.mutateAsync({ id: formState.data.id, data });
        }
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteMut.mutateAsync(deleteId);
            setDeleteId(null);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-8 animate-in fade-in duration-500">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Products
                </h1>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                        onClick={() => setFormState({ open: true, data: null })}
                        className="whitespace-nowrap px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-200"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Product
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
                <DataTable
                    data={products}
                    columns={columns}
                    searchPlaceholder="Search products..."
                    serverSide={true}
                    totalItems={productsData?.total || 0}
                    currentPage={page}
                    itemsPerPage={perPage}
                    onPageChange={setPage}
                    onItemsPerPageChange={(n) => {
                        setPerPage(n);
                        setPage(1);
                    }}
                    onSearchChange={setSearch}
                    onSortChange={(key, direction) => {
                        setSortBy(key);
                        setSortOrder(direction);
                    }}
                    loading={isLoading}
                />
            </div>

            <ProductFormDialog
                open={formState.open}
                onClose={() => setFormState({ open: false, data: null })}
                initialData={formState.data}
                categories={categories}
                onSubmit={formState.data ? handleUpdate : handleCreate}
            />

            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Product?"
                description="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                isLoading={deleteMut.isPending}
            />

            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export const ProductsPage = () => {
    return (
        <PermissionGuard requiredPermission={PERMISSIONS.READ_PRODUCT}>
            <ProductsPageContent />
        </PermissionGuard>
    );
};

export default ProductsPage;
