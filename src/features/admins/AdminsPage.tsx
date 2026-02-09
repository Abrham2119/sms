import { useDataStore } from '../../store/dataStore';
import { DataTable, type Column } from '../../components/table/DataTable';
import { Badge } from '../../components/ui/Badge';
import type { AdminUser } from '../../types';

export const AdminsPage = () => {
    const { admins } = useDataStore();

    const columns: Column<AdminUser>[] = [
        { key: 'name', label: 'Name', sortable: true, searchable: true },
        { key: 'email', label: 'Email', sortable: true, searchable: true },
        { key: 'role', label: 'Role', sortable: true },
        { key: 'lastLogin', label: 'Last Login', sortable: true },
        {
            key: 'status',
            label: 'Status',
            render: (a) => <Badge variant={a.status === 'active' ? 'default' : 'secondary'}>{a.status}</Badge>
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administrators</h1>
                <p className="text-gray-500 dark:text-gray-400">View authorized administrators</p>
            </div>

            <DataTable
                data={admins}
                columns={columns}
                searchPlaceholder="Search admins..."
            />
        </div>
    );
};
