import { useState, useEffect } from 'react';
import { Plus, Mail, Globe, MapPin, User, Eye, Edit2, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/table/DataTable';
import type { Column } from '../../components/table/DataTable';
import { Button } from '../../components/ui/Button';
import { SupplierFormDialog } from './components/SupplierFormDialog';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from './hooks/useSupplier';
import type { Supplier } from '../../types';

import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EntityDetailModal } from '../../components/ui/EntityDetailModal';
import { SupplierStatusModal } from './components/SupplierStatusModal';

export const SuppliersPage = () => {
    const navigate = useNavigate();
    // State
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
    const [managingSupplierStatus, setManagingSupplierStatus] = useState<Supplier | null>(null);
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
    const { data, isLoading } = useSuppliers({
        page,
        per_page: perPage,
        search: debouncedSearch,
        sort_by: sortBy,
        sort_order: sortOrder
    });

    // Mutations
    const createMutation = useCreateSupplier();
    const updateMutation = useUpdateSupplier();
    const deleteMutation = useDeleteSupplier();

    // Handlers
    const handleCreate = () => {
        setEditingSupplier(null);
        setIsModalOpen(true);
    };

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteMutation.mutateAsync(deleteId);
            setDeleteId(null);
        }
    };

    const handleFormSubmit = async (formData: any) => {
        if (editingSupplier) {
            await updateMutation.mutateAsync({ id: editingSupplier.id, data: formData });
        } else {
            await createMutation.mutateAsync(formData);
        }
        setIsModalOpen(false);
    };

    const columns: Column<Supplier>[] = [
        {
            key: 'legal_name',
            label: 'Legal Name',
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
            key: 'status',
            label: 'Status',
            render: (item) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                    item.status === 'suspended' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                    {item.status}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); navigate(`/suppliers/${item.id}/products`); }}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        title="Manage Products"
                    >
                        <Package className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); setViewingSupplier(item); }}
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

    const renderCollapsible = (item: Supplier) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Operating Locations
                </h4>
                <div className="space-y-3">
                    {item.addresses?.map((addr, idx) => (
                        <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 border-l-2 border-primary-100 pl-3 py-1">
                            <span className="font-semibold capitalize text-gray-800 dark:text-gray-200">{addr.type}: </span>
                            {addr.address_line1}, {addr.city}, {addr.country}
                        </div>
                    ))}
                    {!item.addresses?.length && <p className="text-xs text-gray-400 italic">No addresses saved</p>}
                </div>
            </div>
            <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-1">
                    <User className="w-3 h-3" /> Authorized Personnel
                </h4>
                <div className="space-y-3">
                    {item.contacts?.map((contact, idx) => (
                        <div key={idx} className={`text-sm p-3 rounded-xl border ${contact.is_primary ? 'bg-primary-50/50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/20 shadow-sm' : 'border-gray-100 dark:border-gray-700'}`}>
                            <div className="flex items-center justify-between mb-1">
                                <div className="font-bold text-gray-800 dark:text-gray-200">{contact.name}</div>
                                {contact.is_primary && <span className="text-[10px] bg-primary-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Primary</span>}
                            </div>
                            <div className="text-xs text-gray-500 flex flex-col gap-1">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</span>
                                <span className="flex items-center gap-1 font-medium">{contact.role} | {contact.phone}</span>
                            </div>
                        </div>
                    ))}
                    {!item.contacts?.length && <p className="text-xs text-gray-400 italic">No contacts saved</p>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                        Supplier Network
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">
                        Efficiently manage your global supplier ecosystem and procurement partnerships.
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="whitespace-nowrap bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-2xl shadow-xl shadow-primary-200 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Register New Supplier
                </Button>
            </div>

            <DataTable
                data={data?.data || []}
                columns={columns}
                loading={isLoading}
                renderCollapsible={renderCollapsible}
                serverSide
                totalItems={data?.total || 0}
                currentPage={page}
                itemsPerPage={perPage}
                onPageChange={setPage}
                onItemsPerPageChange={setPerPage}
                onSortChange={(key, direction) => {
                    setSortBy(key);
                    setSortOrder(direction);
                }}
                onSearchChange={setSearch}
                searchPlaceholder="Search suppliers by name, TIN..."
            />

            <SupplierFormDialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingSupplier}
                onSubmit={handleFormSubmit}
            />

            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Deactivate Supplier?"
                description="This will permanently remove the supplier and its associations. Are you absolutely certain?"
                confirmText="Terminate Partnership"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />

            <EntityDetailModal
                isOpen={!!viewingSupplier}
                onClose={() => setViewingSupplier(null)}
                title="Partner Profile"
                sections={[
                    {
                        title: "Business Summary",
                        fields: [
                            { label: "Legal Name", value: viewingSupplier?.legal_name },
                            { label: "Public Brand", value: viewingSupplier?.trade_name },
                            { label: "TIN", value: viewingSupplier?.tin },
                            { label: "Account Email", value: viewingSupplier?.email },
                            { label: "Website", value: viewingSupplier?.website },
                            { label: "Lifecycle Status", value: viewingSupplier?.status },
                        ]
                    },
                    {
                        title: "Operating Locations",
                        fields: viewingSupplier?.addresses?.map(addr => ({
                            label: addr.type.toUpperCase(),
                            value: `${addr.address_line1}, ${addr.city}, ${addr.country}`
                        })) || []
                    },
                    {
                        title: "Authorized Personnel",
                        fields: viewingSupplier?.contacts?.map(contact => ({
                            label: contact.name,
                            value: `${contact.role || 'Partner'} | ${contact.phone} ${contact.is_primary ? '(Chief Liaison)' : ''}`
                        })) || []
                    }
                ]}
            />

            <SupplierStatusModal
                isOpen={!!managingSupplierStatus}
                onClose={() => setManagingSupplierStatus(null)}
                supplier={managingSupplierStatus}
            />
        </div>
    );
};

export default SuppliersPage;
