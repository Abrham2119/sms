import { useState } from 'react';
import { Shield, Key, Search } from 'lucide-react';
import { usePermissionsList } from '../roles/hooks/useRole';
import { DataTable } from '../../components/table/DataTable';
import type { Column } from '../../components/table/DataTable';
import { Badge } from '../../components/ui/Badge';
import type { PermissionEntity } from '../../types/entries/role.entry';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { PERMISSIONS } from '../../types';

export const PermissionsPage = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);

    const { data: permissions = [], isLoading } = usePermissionsList();

    const formatPermissionName = (name: string) => {
        return name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getGroupColor = (name: string) => {
        const parts = name.split('_');
        const action = parts[0].toLowerCase();

        switch (action) {
            case 'create': return 'bg-success-50 text-success-700 border-success-100';
            case 'read': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'update': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'delete': return 'bg-danger-50 text-danger-700 border-danger-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const columns: Column<PermissionEntity>[] = [
        {
            key: 'name',
            label: 'Permission Name',
            sortable: true,
            searchable: true,
            render: (p) => (
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${getGroupColor(p.name)}`}>
                        <Shield className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900">{formatPermissionName(p.name)}</div>
                        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">{p.name}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'uuid',
            label: 'UUID Reference',
            render: (p) => (
                <div className="flex items-center gap-2 text-gray-400 font-mono text-xs">
                    <Key className="w-3 h-3" />
                    {p.uuid}
                </div>
            )
        },
        {
            key: 'group',
            label: 'Module',
            render: (p) => {
                const module = p.name.split('_').slice(1).join(' ') || 'General';
                return (
                    <Badge variant="default" className="capitalize bg-gray-100 text-gray-600 border-none font-bold">
                        {module}
                    </Badge>
                );
            }
        }
    ];

    const filteredPermissions = permissions.map(p => ({
        ...p,
        id: p.uuid // Map uuid to id for DataTable
    })).filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.uuid.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <PermissionGuard requiredPermission={PERMISSIONS.READ_PERMISSION}>
            <div className="p-6 max-w-[1400px] mx-auto animate-in fade-in duration-700">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                        System Permissions
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Comprehensive list of all granular access controls available in the system.
                    </p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
                    <div className="mb-6 relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Filter permissions by name or UUID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium"
                        />
                    </div>

                    <DataTable
                        data={filteredPermissions}
                        columns={columns}
                        loading={isLoading}
                        serverSide={false}
                        totalItems={filteredPermissions.length}
                        currentPage={page}
                        itemsPerPage={perPage}
                        onPageChange={setPage}
                        onItemsPerPageChange={setPerPage}
                    />
                </div>
            </div>
        </PermissionGuard>
    );
};
