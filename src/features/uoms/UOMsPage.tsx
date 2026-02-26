import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";
import type { UOM } from "../../types";
import { PERMISSIONS } from "../../types";
import { PermissionGuard } from "../../components/guards/PermissionGuard";
import {
    useUOMs,
    useCreateUOM,
    useUpdateUOM,
    useDeleteUOM,
} from "./hooks/useUOM";
import { UOMFormDialog } from "./components/UOMFormDialog";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/table/DataTable";
import type { Column } from "../../components/table/DataTable";
import { Edit2, Trash2, Eye } from "lucide-react";

import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EntityDetailModal } from "../../components/ui/EntityDetailModal";
import { Badge } from "../../components/ui/Badge";

export const UOMsPage = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortBy, setSortBy] = useState<string | undefined>();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();
    const [viewingUOM, setViewingUOM] = useState<UOM | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: uomsResponse, isLoading } = useUOMs({
        page,
        per_page: perPage,
        search: debouncedSearch,
        sort_by: sortBy,
        sort_order: sortOrder
    });
    const uoms = uomsResponse?.data || [];

    const [formState, setFormState] = useState<{
        open: boolean;
        data: UOM | null;
    }>({ open: false, data: null });

    const createMut = useCreateUOM();
    const updateMut = useUpdateUOM();
    const deleteMut = useDeleteUOM();

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const columns: Column<UOM>[] = [
        { key: 'name', label: 'Name', sortable: true, searchable: true },
        { key: 'abbreviation', label: 'Abbreviation', sortable: true, searchable: true },
        {
            key: 'description',
            label: 'Description',
            sortable: true,
            searchable: true,
            render: (u) => <span className="italic text-gray-500">{u.description || '-'}</span>
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (u) => (
                <Badge variant={u.is_active ? 'success' : 'neutral'}>
                    {u.is_active ? 'Active' : 'Inactive'}
                </Badge>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (u) => (
                <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setViewingUOM(u); }}>
                        <Eye className="w-4 h-4 text-primary-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFormState({ open: true, data: u }); }}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                        onClick={(e) => { e.stopPropagation(); setDeleteId(u.id); }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    const handleCreate = async (data: { name: string; abbreviation: string; description: string | null; is_active: boolean }) => {
        await createMut.mutateAsync(data);
    };

    const handleUpdate = async (data: { name: string; abbreviation: string; description: string | null; is_active: boolean }) => {
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
                    Units of Measurement
                </h1>
                <Button
                    onClick={() => setFormState({ open: true, data: null })}
                    className="w-full sm:w-auto px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} />
                    Add UOM
                </Button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
                <DataTable
                    data={uoms}
                    columns={columns}
                    searchPlaceholder="Search UOMs..."
                    serverSide={true}
                    totalItems={uomsResponse?.total || 0}
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

            <UOMFormDialog
                open={formState.open}
                onClose={() => setFormState({ open: false, data: null })}
                initialData={formState.data}
                onSubmit={formState.data ? handleUpdate : handleCreate}
            />

            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Unit of Measurement?"
                description="Are you sure you want to delete this Unit of Measurement? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                isLoading={deleteMut.isPending}
            />

            <EntityDetailModal
                isOpen={!!viewingUOM}
                onClose={() => setViewingUOM(null)}
                title="UOM Details"
                sections={[
                    {
                        title: "UOM Information",
                        fields: [
                            { label: "Name", value: viewingUOM?.name },
                            { label: "Abbreviation", value: viewingUOM?.abbreviation },
                            { label: "Description", value: viewingUOM?.description || 'No description provided.' },
                            { label: "Status", value: viewingUOM?.is_active ? 'Active' : 'Inactive' },
                        ]
                    }
                ]}
            />

            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export const UOMsPageWithGuard = () => {
    return (
        <PermissionGuard requiredPermission={PERMISSIONS.READ_PRODUCT}>
            <UOMsPage />
        </PermissionGuard>
    );
};

export default UOMsPageWithGuard;
