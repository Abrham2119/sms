import { useState } from "react";
import { Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";
import type { Category } from "../../types";
import { PERMISSIONS } from "../../types";
import { PermissionGuard } from "../../components/guards/PermissionGuard";
import {
    useCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from "./hooks/useCategory";
import { CategoryFormDialog } from "./components/CategoryFormDialog";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/table/DataTable";
import type { Column } from "../../components/table/DataTable";
import { Edit2, Trash2, Eye } from "lucide-react";

import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EntityDetailModal } from "../../components/ui/EntityDetailModal";

export const CategoriesPage = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string | undefined>();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();
    const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
    const { data: categoriesResponse, isLoading } = useCategories({
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder
    });
    const categories = categoriesResponse?.data || [];

    // In a real app with hierarchy, we might not paginate or we page root nodes. 
    // Assuming backend handles it or we fetch all for small dataset.

    const [formState, setFormState] = useState<{
        open: boolean;
        data: Category | null;
    }>({ open: false, data: null });

    const createMut = useCreateCategory();
    const updateMut = useUpdateCategory();
    const deleteMut = useDeleteCategory();

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const columns: Column<Category>[] = [
        { key: 'name', label: 'Name', sortable: true, searchable: true },
        {
            key: 'description',
            label: 'Description',
            sortable: true,
            searchable: true,
            render: (c) => <span className="italic text-gray-500">{c.description || '-'}</span>
        },
        {
            key: 'parent',
            label: 'Parent',
            render: (c) => <span className="text-gray-700">{c.parent?.name || '-'}</span>
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (c) => (
                <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setViewingCategory(c); }}>
                        <Eye className="w-4 h-4 text-primary-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFormState({ open: true, data: c }); }}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                        onClick={(e) => { e.stopPropagation(); setDeleteId(c.id); }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    const handleCreate = async (data: { name: string; parent_id: string | null; description?: string }) => {
        await createMut.mutateAsync(data);
    };

    const handleUpdate = async (data: { name: string; parent_id: string | null; description?: string }) => {
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
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Categories
                </h1>
                <Button
                    onClick={() => setFormState({ open: true, data: null })}
                    className="w-full sm:w-auto px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} />
                    Add Category
                </Button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
                <DataTable
                    data={categories}
                    columns={columns}
                    searchPlaceholder="Search categories..."
                    serverSide={true}
                    totalItems={categoriesResponse?.total || 0}
                    currentPage={page}
                    itemsPerPage={perPage}
                    onPageChange={setPage}
                    onItemsPerPageChange={(n) => {
                        setPerPage(n);
                        setPage(1);
                    }}
                    onSortChange={(key, direction) => {
                        setSortBy(key);
                        setSortOrder(direction);
                    }}
                    loading={isLoading}
                />
            </div>

            <CategoryFormDialog
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
                title="Delete Category?"
                description="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                isLoading={deleteMut.isPending}
            />

            <EntityDetailModal
                isOpen={!!viewingCategory}
                onClose={() => setViewingCategory(null)}
                title="Category Details"
                sections={[
                    {
                        title: "Category Information",
                        fields: [
                            { label: "Category Name", value: viewingCategory?.name },
                            {
                                label: "Parent Category",
                                value: viewingCategory?.parent_id
                                    ? categories.find(cat => cat.id === viewingCategory.parent_id)?.name || 'Unknown'
                                    : 'Root'
                            },
                            { label: "Description", value: viewingCategory?.description || 'No description provided.' },
                        ]
                    }
                ]}
            />

            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export const CategoriesPageWithGuard = () => {
    return (
        <PermissionGuard requiredPermission={PERMISSIONS.READ_CATEGORY}>
            <CategoriesPage />
        </PermissionGuard>
    );
};

export default CategoriesPageWithGuard;
