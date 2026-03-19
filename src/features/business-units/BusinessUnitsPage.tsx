import { useState, useEffect } from 'react';
import { Plus, Mail, Globe, Eye, Edit2, Trash2, Building2 } from 'lucide-react';
import { DataTable } from '../../components/table/DataTable';
import type { Column } from '../../components/table/DataTable';
import { Button } from '../../components/ui/Button';
import { BusinessUnitFormDialog } from './components/BusinessUnitFormDialog';
import { useBusinessUnits, useCreateBusinessUnit, useUpdateBusinessUnit, useDeleteBusinessUnit } from './hooks/useBusinessUnits';
import type { BusinessUnit } from '../../types';
import { PERMISSIONS } from '../../types';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EntityDetailModal } from '../../components/ui/EntityDetailModal';
import { PermissionGuard } from '../../components/guards/PermissionGuard';

const BusinessUnitsPageContent = () => {
    // State
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<BusinessUnit | null>(null);
    const [viewingUnit, setViewingUnit] = useState<BusinessUnit | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string | undefined>();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Data fetching
    const { data, isLoading } = useBusinessUnits({
        page,
        per_page: perPage,
        search: debouncedSearch,
        sort_by: sortBy,
        sort_order: sortOrder
    });

    // Mutations
    const createMutation = useCreateBusinessUnit();
    const updateMutation = useUpdateBusinessUnit();
    const deleteMutation = useDeleteBusinessUnit();

    // Handlers
    const handleCreate = () => {
        setEditingUnit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (unit: BusinessUnit) => {
        setEditingUnit(unit);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteMutation.mutateAsync(deleteId);
            setDeleteId(null);
        }
    };

    const handleFormSubmit = async (formData: any) => {
        if (editingUnit) {
            await updateMutation.mutateAsync({ id: editingUnit.id, data: formData });
        } else {
            await createMutation.mutateAsync(formData);
        }
        setIsModalOpen(false);
    };

    const columns: Column<BusinessUnit>[] = [
        {
            key: 'logo',
            label: 'Logo',
            render: (item) => (
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center">
                    {item.logo ? (
                        <img
                            src={item.logo.startsWith('http') ? item.logo : `${import.meta.env.VITE_API_BASE_URL}/storage/${item.logo}`}
                            alt={item.legal_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.legal_name) + '&background=random';
                            }}
                        />
                    ) : (
                        <Building2 className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            )
        },
        {
            key: 'legal_name',
            label: 'Business Details',
            sortable: true,
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">{item.legal_name}</span>
                    <span className="text-xs text-gray-500">{item.trade_name}</span>
                </div>
            )
        },
        {
            key: 'email',
            label: 'Contact Info',
            render: (item) => (
                <div className="flex flex-col text-sm">
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <Mail className="w-3 h-3" /> {item.email}
                    </span>
                    {item.website && (
                        <span className="flex items-center gap-1 text-xs text-primary-500">
                            <Globe className="w-3 h-3" /> {item.website}
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'tin',
            label: 'TIN',
            sortable: true,
            render: (item) => (
                <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{item.tin}</code>
            )
        },
        {
            key: 'type',
            label: 'Type',
            render: (item) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${item.type === 'foreign'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                    {item.type}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item) => (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); setViewingUnit(item); }}
                    >
                        <Eye className="w-4 h-4 text-primary-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                        onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                        Business Units
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">
                        Manage your company's business units, legal entities, and operational branches.
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="whitespace-nowrap bg-primary-500 hover:bg-primary-600 text-black font-bold py-3 px-6 rounded-2xl shadow-xl shadow-primary-500/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Business Unit
                </Button>
            </div>

            <DataTable
                data={data || []}
                columns={columns}
                loading={isLoading}
                totalItems={data?.length || 0}
                currentPage={page}
                itemsPerPage={perPage}
                onPageChange={setPage}
                onItemsPerPageChange={setPerPage}
                onSortChange={(key, direction) => {
                    setSortBy(key);
                    setSortOrder(direction);
                }}
                onSearchChange={setSearch}
                searchPlaceholder="Search business units by name, TIN..."
            />

            <BusinessUnitFormDialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingUnit}
                onSubmit={handleFormSubmit}
            />

            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Business Unit?"
                description="This action cannot be undone. Are you sure you want to delete this business unit?"
                confirmText="Delete Unit"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />

            <EntityDetailModal
                isOpen={!!viewingUnit}
                onClose={() => setViewingUnit(null)}
                title="Business Unit Profile"
                sections={[
                    {
                        title: "Entity Details",
                        fields: [
                            { label: "Legal Name", value: viewingUnit?.legal_name },
                            { label: "Trade Name", value: viewingUnit?.trade_name },
                            { label: "TIN", value: viewingUnit?.tin },
                            { label: "Email", value: viewingUnit?.email },
                            { label: "Phone", value: viewingUnit?.phone || 'N/A' },
                            { label: "Website", value: viewingUnit?.website || 'N/A' },
                            { label: "Type", value: viewingUnit?.type },
                            { label: "Created At", value: viewingUnit?.created_at ? new Date(viewingUnit.created_at).toLocaleDateString() : 'N/A' },
                        ]
                    }
                ]}
            />
        </div>
    );
};

export const BusinessUnitsPage = () => {
    return (
        <PermissionGuard requiredPermission={PERMISSIONS.READ_BUSINESS_UNIT}>
            <BusinessUnitsPageContent />
        </PermissionGuard>
    );
};

export default BusinessUnitsPage;
