import { useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Plus, Search } from "lucide-react";
import type { Role } from "./types";
import {
    useRoles,
    usePermissionsList,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
} from "./hooks/useRole";
import { RoleTable } from "./components/RoleTable";
import { RoleFormDialog } from "./components/RoleFormDialog";

// Define a simple Tailwind-styled Modal for Delete Confirmation since it's small
const DeleteConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Role?</h3>
                <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete this role? All associated permission
                    assignments will be removed. This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg shadow-red-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export const RolesPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [search, setSearch] = useState("");

    // Hooks
    const { data: roles = [], isLoading } = useRoles();
    const { data: permissions = [] } = usePermissionsList({
        enabled: activeTab !== 0, // Load permissions if not in Roles tab (or strictly when needed)
    });

    // Mutations
    const createMut = useCreateRole();
    const updateMut = useUpdateRole();
    const deleteMut = useDeleteRole();

    // Local State
    const [formState, setFormState] = useState<{
        open: boolean;
        data: Role | null;
    }>({ open: false, data: null });


    // Derived State
    const filteredRoles = useMemo(() => {
        return (
            roles?.filter((r) =>
                r.name.toLowerCase().includes(search.toLowerCase()),
            ) || []
        );
    }, [roles, search]);

    const groupedPermissions = useMemo(() => {
        const groups: { [key: string]: string[] } = {};
        permissions?.forEach((p) => {
            const groupName = p.name.split("_").slice(1).join(" ") || "General";
            const category =
                groupName.charAt(0).toUpperCase() + groupName.split(" ")[0].slice(1);

            if (!groups[category]) groups[category] = [];
            groups[category].push(p.name);
        });
        return groups;
    }, [permissions]);

    // Handlers
    const handleCreate = async (data: {
        name: string;
        permissions: string[];
    }) => {
        await createMut.mutateAsync(data);
    };

    const handleUpdate = async (data: {
        name: string;
        permissions: string[];
    }) => {
        if (formState.data) {
            await updateMut.mutateAsync({ uuid: formState.data.uuid, data });
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
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Role and Permission
                </h1>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Tabs Header */}
                <div className="px-6 pt-4 border-b border-gray-100">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab(0)}
                            className={`
                                pb-4 text-base font-extrabold transition-all relative
                                ${activeTab === 0
                                    ? "text-blue-600"
                                    : "text-gray-400 hover:text-gray-600"
                                }
                            `}
                        >
                            Roles
                            {activeTab === 0 && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />
                            )}
                        </button>
                        {/* We could add a Permissions tab here if needed later */}
                    </div>
                </div>

                <div className="p-8">
                    {activeTab === 0 ? (
                        <div className="space-y-6">
                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="relative w-full sm:w-[300px]">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium"
                                    />
                                </div>
                                <button
                                    onClick={() => setFormState({ open: true, data: null })}
                                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200"
                                >
                                    <Plus size={20} />
                                    Add Role
                                </button>
                            </div>

                            {/* Table/List */}
                            <RoleTable
                                roles={filteredRoles}
                                loading={isLoading}
                                onEdit={(r) => setFormState({ open: true, data: r })}
                                onDelete={(r) => setDeleteId(r.uuid)}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {Object.entries(groupedPermissions).map(([category, perms]) => (
                                <div
                                    key={category}
                                    className="p-6 rounded-3xl border border-gray-200 hover:border-blue-200 transition-colors bg-white"
                                >
                                    <h3 className="text-lg font-extrabold text-blue-600 mb-4">
                                        {category}
                                    </h3>
                                    <div className="space-y-2">
                                        {perms.map((p) => (
                                            <p key={p} className="text-sm font-medium text-gray-500">
                                                {p}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Dialogs */}
            <RoleFormDialog
                open={formState.open}
                onClose={() => setFormState({ open: false, data: null })}
                initialData={formState.data}
                permissions={permissions || []} // Pass fetched permissions
                onSubmit={formState.data ? handleUpdate : handleCreate}
            />

            <DeleteConfirmationDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
            />

            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};
