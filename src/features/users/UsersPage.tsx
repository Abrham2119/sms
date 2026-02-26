import { Edit2, Eye, Mail, Phone, Plus, Shield, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import type { Column } from '../../components/table/DataTable';
import { DataTable } from '../../components/table/DataTable';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { User } from '../../types';
import { PERMISSIONS } from '../../types';
import { Tooltip } from '../../components/ui/Tooltip';
import { CustomDropdown } from '../../components/ui/CustomDropdown';

import { useRoles } from '../roles/hooks/useRole';
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from './hooks/useUser';

import { UserFormDialog } from './components/UserFormDialog';
import { UserRoleModal } from './components/UserRoleModal';
import { UserStatusModal } from './components/UserStatusModal';

const UsersPageContent = () => {
    const navigate = useNavigate();
    // State
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [assigningRoleUser, setAssigningRoleUser] = useState<User | null>(null);
    const [managingUserStatus, setManagingUserStatus] = useState<User | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Sort state
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
    const { data, isLoading } = useUsers({
        page,
        per_page: perPage,
        search: debouncedSearch,
        sort_by: sortBy,
        sort_order: sortOrder
    });

    // We need roles to populate the dropdowns
    const { data: rolesResponse } = useRoles();
    const rolesList = rolesResponse?.map((r: any) => ({ id: r.uuid, name: r.name })) || [];

    // Mutations
    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();
    const deleteMutation = useDeleteUser();

    // Handlers
    const handleCreate = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteMutation.mutateAsync(deleteId);
            setDeleteId(null);
        }
    };

    const handleFormSubmit = async (formData: any) => {
        if (editingUser) {
            await updateMutation.mutateAsync({ id: editingUser.id, data: formData });
        } else {
            await createMutation.mutateAsync(formData);
        }
    };

    const columns: Column<User>[] = [
        {
            key: 'name',
            label: 'User',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 font-bold border border-primary-200 dark:border-primary-800">
                        {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'email',
            label: 'Contact',
            render: (item) => (
                <div className="flex flex-col text-sm gap-1">
                    <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                        <Mail className="w-3.5 h-3.5 text-gray-400" /> {item.email}
                    </span>
                    {item.phone && (
                        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                            <Phone className="w-3.5 h-3.5 text-gray-400" /> {item.phone}
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'roles',
            label: 'Role',
            render: (item) => {
                if (!item.roles || item.roles.length === 0) {
                    return <span className="text-xs text-gray-400 italic">No Role</span>;
                }
                const formattedRoles = item.roles.map((role: any) => {
                    const name = typeof role === 'string' ? role : role.name;
                    return name.replace(/_/g, ' ');
                });

                const visibleRoles = formattedRoles.slice(0, 3);
                const remainingCount = formattedRoles.length - 3;

                return (
                    <div className="flex items-center gap-2">
                        {visibleRoles.map((role, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-100 dark:border-primary-800">
                                <Shield className="w-3 h-3" />
                                {role}
                            </span>
                        ))}
                        {remainingCount > 0 && (
                            <Tooltip content={formattedRoles.slice(3).join(', ')}>
                                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-help border border-gray-200 dark:border-gray-700 shrink-0">
                                    +{remainingCount}
                                </div>
                            </Tooltip>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'status',
            label: 'Status',
            render: (item) => (
                <div onClick={(e) => e.stopPropagation()} className="w-36">
                    <CustomDropdown
                        options={[
                            { label: 'Active', value: 'active' },
                            { label: 'Deactivated', value: 'inactive' }
                        ]}
                        value={item.status || 'inactive'}
                        onChange={(val) => {
                            if (val !== item.status) {
                                setManagingUserStatus(item);
                            }
                        }}
                        className="h-8"
                    />
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item) => (
                <div className="flex justify-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); navigate(`/users/${item.id}`); }}
                        title="View Details"
                        className="text-gray-500 hover:text-primary-600 hover:bg-primary-50"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                        title="Edit User"
                        className="text-gray-500 hover:text-primary-600 hover:bg-primary-50"
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>

                    {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); setAssigningRoleUser(item); }}
                        title="Assign Role"
                        className="text-gray-500 hover:text-purple-600 hover:bg-purple-50"
                    >
                        <Tag className="w-4 h-4" />
                    </Button> */}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                        title="Delete User"
                        className="text-gray-500 hover:text-danger-600 hover:bg-danger-50"
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
                        User Management
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">
                        View, create, and manage system users and their access levels.
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="whitespace-nowrap bg-primary-500 hover:bg-primary-600 text-black font-bold py-3 px-6 rounded-2xl shadow-xl shadow-primary-200 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New User
                </Button>
            </div>

            <DataTable
                data={data?.data || []}
                columns={columns}
                loading={isLoading}
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
                searchPlaceholder="Search users by name, email, or phone..."
                onRowClick={(item) => navigate(`/users/${item.id}`)}
            />

            <UserFormDialog
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={editingUser}
                onSubmit={handleFormSubmit}
                roles={rolesList}
            />

            <UserRoleModal
                isOpen={!!assigningRoleUser}
                onClose={() => setAssigningRoleUser(null)}
                user={assigningRoleUser}
                roles={rolesList}
            />

            <UserStatusModal
                isOpen={!!managingUserStatus}
                onClose={() => setManagingUserStatus(null)}
                user={managingUserStatus}
            />

            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete User?"
                description="This action cannot be undone. This will permanently remove the user from the system."
                confirmText="Yes"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
};

export const UsersPage = () => {
    return (
        <PermissionGuard requiredPermission={PERMISSIONS.READ_USER}>
            <UsersPageContent />
        </PermissionGuard>
    );
};

export default UsersPage;
