import { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { DataTable, type Column } from '../../components/table/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { SupplierForm } from './SupplierForm';
import type { Supplier, SupplierStatus } from '../../types';
import { Plus, Edit, Trash2, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

export const SuppliersPage = () => {
    const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useDataStore();
    const { roles } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(undefined);

    const hasRole = (roleName: string) => roles.some(r => r.name.toLowerCase() === roleName.toLowerCase());

    const canEdit = hasRole('admin') || hasRole('supplier');
    const canDelete = hasRole('admin');

    const handleCreate = (data: any) => {
        addSupplier(data);
        setIsModalOpen(false);
        toast.success("Supplier added successfully");
    };

    const handleUpdate = (data: any) => {
        if (editingSupplier) {
            updateSupplier(editingSupplier.id, data);
            setIsModalOpen(false);
            setEditingSupplier(undefined);
            toast.success("Supplier updated successfully");
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            deleteSupplier(id);
            toast.success("Supplier deleted");
        }
    };

    const openEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const openCreate = () => {
        setEditingSupplier(undefined);
        setIsModalOpen(true);
    };

    const getStatusVariant = (status: SupplierStatus) => {
        switch (status) {
            case 'active': return 'default'; // Blueish or Greenish? Custom 'success' not in Badge types yet, reusing 'default' (blue-100) or 'secondary'
            case 'inactive': return 'secondary';
            case 'pending': return 'warning'; // If we add warning to Badge
            case 'blacklisted': return 'destructive';
            default: return 'default';
        }
    };

    const columns: Column<Supplier>[] = [
        { key: 'companyName', label: 'Company', sortable: true, searchable: true },
        { key: 'category', label: 'Category', sortable: true },
        {
            key: 'contact',
            label: 'Contact',
            render: (s) => (
                <div className="flex flex-col text-xs">
                    <span className="font-medium">{s.contactPerson}</span>
                    <span className="flex items-center gap-1 text-gray-400"><Mail className="w-3 h-3" /> {s.email}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (s) => <Badge variant={getStatusVariant(s.status)}>{s.status}</Badge>
        },
        {
            key: 'rating',
            label: 'Rating',
            sortable: true,
            render: (s) => <span className="font-mono">{s.rating.toFixed(1)} ★</span>
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (s) => (
                <div className="flex items-center gap-2">
                    {canEdit && (
                        <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
                            <Edit className="w-4 h-4" />
                        </Button>
                    )}
                    {canDelete && (
                        <Button variant="ghost" size="sm" className="text-danger-600 hover:text-danger-700" onClick={() => handleDelete(s.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    const collapsibleRender = (s: Supplier) => (
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <p className="font-semibold text-gray-500">Address</p>
                <p>{s.address}</p>
            </div>
            <div>
                <p className="font-semibold text-gray-500">Joined Date</p>
                <p>{s.joinedDate}</p>
            </div>
            <div>
                <p className="font-semibold text-gray-500">Phone</p>
                <p>{s.phone}</p>
            </div>
        </div>
    );

    // TODO: Replace with real API -> e.g. axios.get('/suppliers') or use react-query

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Suppliers</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your supplier database</p>
                </div>
                {canEdit && (
                    <Button onClick={openCreate} className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Supplier
                    </Button>
                )}
            </div>

            <DataTable
                data={suppliers}
                columns={columns}
                searchPlaceholder="Search suppliers..."
                renderCollapsible={collapsibleRender}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            >
                <SupplierForm
                    initialData={editingSupplier}
                    onSubmit={editingSupplier ? handleUpdate : handleCreate}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};
