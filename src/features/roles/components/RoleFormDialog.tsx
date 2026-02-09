import { useEffect, useMemo, useState } from 'react';
import { X, Search } from 'lucide-react';
import type { Permission, Role } from '../types';

interface RoleFormDialogProps {
    open: boolean;
    onClose: () => void;
    initialData?: Role | null;
    permissions: Permission[];
    onSubmit: (data: { name: string; permissions: string[] }) => Promise<void>;
}

export const RoleFormDialog: React.FC<RoleFormDialogProps> = ({
    open,
    onClose,
    initialData,
    permissions,
    onSubmit
}) => {
    const [name, setName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            if (initialData) {
                setName(initialData.name);
                setSelectedPermissions(initialData.permissions.map(p => p.uuid));
            } else {
                setName('');
                setSelectedPermissions([]);
            }
            setSearch('');
        }
    }, [open, initialData]);

    const filteredPermissions = useMemo(() => {
        return permissions.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }, [permissions, search]);

    const isAllSelected = useMemo(() => {
        if (filteredPermissions.length === 0) return false;
        return filteredPermissions.every(p => selectedPermissions.includes(p.uuid));
    }, [filteredPermissions, selectedPermissions]);

    const handleSelectAll = () => {
        if (isAllSelected) {
            const filteredUuids = filteredPermissions.map(p => p.uuid);
            setSelectedPermissions(prev => prev.filter(uuid => !filteredUuids.includes(uuid)));
        } else {
            const filteredUuids = filteredPermissions.map(p => p.uuid);
            setSelectedPermissions(prev => Array.from(new Set([...prev, ...filteredUuids])));
        }
    };

    const handleToggle = (uuid: string) => {
        setSelectedPermissions(prev =>
            prev.includes(uuid) ? prev.filter(id => id !== uuid) : [...prev, uuid]
        );
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || submitting) return;
        setSubmitting(true);
        try {
            await onSubmit({ name, permissions: selectedPermissions });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-xl font-extrabold text-gray-900">
                            {initialData ? 'Edit Role' : 'Add Role'}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">
                                Role Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                                placeholder="New Role"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-extrabold text-gray-900">Attach Permissions</h3>
                                {filteredPermissions.length > 0 && (
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                        />
                                        <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700">Select All Visible</span>
                                    </label>
                                )}
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                                    placeholder="Search permissions..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto p-1">
                                {filteredPermissions.map((perm) => (
                                    <div
                                        key={perm.uuid}
                                        onClick={() => handleToggle(perm.uuid)}
                                        className={`
                                            p-3 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-2
                                            ${selectedPermissions.includes(perm.uuid)
                                                ? 'border-blue-500 bg-blue-50/50'
                                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <div className={`
                                            w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors
                                            ${selectedPermissions.includes(perm.uuid)
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'border-gray-300 bg-white'
                                            }
                                        `}>
                                            {selectedPermissions.includes(perm.uuid) && (
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 leading-tight select-none">
                                            {perm.name}
                                        </span>
                                    </div>
                                ))}
                                {filteredPermissions.length === 0 && (
                                    <div className="col-span-full py-8 text-center text-sm text-gray-500">
                                        No permissions found matching "{search}"
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 rounded-b-3xl">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !name}
                            className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-200"
                        >
                            {submitting ? 'Saving...' : initialData ? 'Update Role' : 'Add Role'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
