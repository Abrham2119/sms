import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Mail, Globe, MapPin, Search, User, Eye } from 'lucide-react';
import { DataTable, type Column } from '../../components/table/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SupplierFormDialog } from './components/SupplierFormDialog';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from './hooks/useSupplier';
import type { Supplier } from '../../types';

import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EntityDetailModal } from '../../components/ui/EntityDetailModal';
import { SupplierStatusModal } from './components/SupplierStatusModal';

export const SuppliersPage = () => {
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

    // Table Columns
    const columns: Column<Supplier>[] = [
        {
            key: 'legal_name',
            label: 'Legal Name',
            sortable: true,
            searchable: true,
            render: (s) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">{s.legal_name}</span>
                    <span className="text-xs text-gray-500">{s.trade_name}</span>
                </div>
            )
        },
        {
            key: 'email',
            label: 'Contact Info',
            render: (s) => (
                <div className="flex flex-col text-sm">
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <Mail className="w-3 h-3" /> {s.email}
                    </span>
                    {s.website && (
                        <span className="flex items-center gap-1 text-xs text-primary-500">
                            <Globe className="w-3 h-3" /> {s.website}
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'tin',
            label: 'TIN',
            sortable: true,
            render: (s) => <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{s.tin}</code>
        },
        {
            key: 'status',
            label: 'Status',
            render: (s) => (
                <button
                    onClick={(e) => { e.stopPropagation(); setManagingSupplierStatus(s); }}
                    className="hover:scale-105 transition-transform cursor-pointer"
                    title="Change Status & Upload Attachments"
                >
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.status === 'active'
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : s.status === 'suspended'
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                        {s.status}
                    </span>
                </button>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (s) => (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setViewingSupplier(s); }}>
                        <Eye className="w-4 h-4 text-primary-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(s); }}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                        onClick={(e) => { e.stopPropagation(); setDeleteId(s.id); }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    const renderCollapsible = (s: Supplier) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Addresses
                </h4>
                <div className="space-y-2">
                    {s.addresses?.map((addr) => (
                        <div key={addr.id} className="text-sm text-gray-600 dark:text-gray-400 border-l-2 border-gray-100 pl-3">
                            <span className="font-semibold capitalize text-gray-800 dark:text-gray-200">{addr.type}: </span>
                            {addr.address_line1}, {addr.city}, {addr.country}
                        </div>
                    ))}
                    {!s.addresses?.length && <p className="text-xs text-gray-400 italic">No addresses saved</p>}
                </div>
            </div>
            <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                    <User className="w-3 h-3" /> Primary Contacts
                </h4>
                <div className="space-y-2">
                    {s.contacts?.map((contact) => (
                        <div key={contact.id} className={`text-sm p-2 rounded ${contact.is_primary ? 'bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20' : ''}`}>
                            <div className="font-semibold text-gray-800 dark:text-gray-200">{contact.name} {contact.is_primary && <span className="text-[10px] bg-primary-500 text-white px-1 rounded ml-1">PRIMARY</span>}</div>
                            <div className="text-xs text-gray-500">{contact.role} | {contact.phone}</div>
                        </div>
                    ))}
                    {!s.contacts?.length && <p className="text-xs text-gray-400 italic">No contacts saved</p>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Supplier Management</h1>
                    <p className="text-gray-500 text-sm">Manage company profiles, legal information, and primary contacts.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search suppliers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={handleCreate} className="whitespace-nowrap">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Supplier
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
                <DataTable
                    data={data?.data || []}
                    columns={columns}
                    searchPlaceholder="Search suppliers..."
                    serverSide={true}
                    totalItems={data?.total || 0}
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
                    renderCollapsible={renderCollapsible}
                />
            </div>

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
                title="Delete Supplier?"
                description="Are you sure you want to delete this supplier? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />

            <EntityDetailModal
                isOpen={!!viewingSupplier}
                onClose={() => setViewingSupplier(null)}
                title="Supplier Details"
                sections={[
                    {
                        title: "Basic Info",
                        fields: [
                            { label: "Legal Name", value: viewingSupplier?.legal_name },
                            { label: "Trade Name", value: viewingSupplier?.trade_name },
                            { label: "Email", value: viewingSupplier?.email },
                            { label: "Website", value: viewingSupplier?.website },
                            { label: "TIN", value: viewingSupplier?.tin },
                            { label: "Status", value: viewingSupplier?.status },
                        ]
                    },
                    {
                        title: "Addresses",
                        fields: viewingSupplier?.addresses?.map(addr => ({
                            label: addr.type.toUpperCase(),
                            value: `${addr.address_line1}, ${addr.city}, ${addr.country}`
                        })) || []
                    },
                    {
                        title: "Contacts",
                        fields: viewingSupplier?.contacts?.map(contact => ({
                            label: contact.name,
                            value: `${contact.role || 'No Role'} | ${contact.phone} ${contact.is_primary ? '(Primary)' : ''}`
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
