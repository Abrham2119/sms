import { useEffect, useState } from 'react';
import { Activity, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, Monitor, Search, User as UserIcon } from 'lucide-react';
import { useSupplierActivities } from '../../features/suppliers/hooks/useSupplier';
import { useProductActivities } from '../../features/products/hooks/useProduct';
import { useUserActivities } from '../../features/users/hooks/useUser';

interface ActivityLogProps {
    entityType: 'supplier' | 'product' | 'user';
    entityId: string;
}

interface ActivityChange {
    field: string;
    old: string | null;
    new: string | null;
    type: string;
}

interface ActivityEntry {
    id: string | null;
    type: string;
    actor: {
        id: string;
        name: string;
        email: string;
        avatar: string | null;
        initials: string;
    };
    action: string;
    target: string;
    target_id: string;
    target_name: string;
    changes: ActivityChange[];
    timestamp: string;
    timestamp_human: string;
    metadata: {
        ip_address: string;
        user_agent: string;
        url: string;
    };
}

const TYPE_COLORS: Record<string, string> = {
    update: 'bg-blue-500',
    create: 'bg-green-500',
    delete: 'bg-red-500',
    Login: 'bg-purple-500',
    default: 'bg-gray-400',
};

const typeColor = (type: string) => TYPE_COLORS[type] ?? TYPE_COLORS.default;

const ChangesDetail = ({ changes }: { changes: ActivityChange[] }) => {
    const [open, setOpen] = useState(false);
    if (!changes?.length) return null;
    return (
        <div className="mt-3">
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
                {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {changes.length} field{changes.length !== 1 ? 's' : ''} changed
            </button>
            {open && (
                <div className="mt-2 space-y-1.5">
                    {changes.map((c, i) => (
                        <div key={i} className="flex flex-wrap items-start gap-2 text-xs bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-200 min-w-[80px]">{c.field}</span>
                            <span className="text-red-500 line-through opacity-70">{c.old ?? <em className="not-italic text-gray-400">empty</em>}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-green-600 dark:text-green-400 font-medium">{c.new ?? <em className="not-italic text-gray-400">empty</em>}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Unified hook that routes to the correct query based on entityType
const useActivityData = (entityType: 'supplier' | 'product' | 'user', entityId: string, params: any) => {
    const supplierResult = useSupplierActivities(
        entityType === 'supplier' ? entityId : '',
        entityType === 'supplier' ? params : undefined
    );
    const productResult = useProductActivities(
        entityType === 'product' ? entityId : '',
        entityType === 'product' ? params : undefined
    );
    const userResult = useUserActivities(
        entityType === 'user' ? entityId : '',
        entityType === 'user' ? params : undefined
    );

    if (entityType === 'supplier') {
        const raw = supplierResult.data;
        // Full envelope: { success, message, data: { data:[], total, last_page, ... } }
        const list: ActivityEntry[] = raw?.data?.data ?? [];
        const total: number = raw?.data?.total ?? 0;
        const lastPage: number = raw?.data?.last_page ?? 1;
        return { list, total, lastPage, isLoading: supplierResult.isLoading };
    } else if (entityType === 'product') {
        const raw = productResult.data;
        // Full envelope: { success, message, data: { data:[], total, last_page, ... } }
        const list: ActivityEntry[] = raw?.data?.data ?? [];
        const total: number = raw?.data?.total ?? 0;
        const lastPage: number = raw?.data?.last_page ?? 1;
        return { list, total, lastPage, isLoading: productResult.isLoading };
    } else {
        const raw = userResult.data;
        // Full envelope: { success, message, data: { data:[], total, last_page, ... } }
        const list: ActivityEntry[] = raw?.data?.data ?? [];
        const total: number = raw?.data?.total ?? 0;
        const lastPage: number = raw?.data?.last_page ?? 1;
        return { list, total, lastPage, isLoading: userResult.isLoading };
    }
};

export const ActivityLog = ({ entityType, entityId }: ActivityLogProps) => {
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search — same pattern as SuppliersPage / ProductsPage
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const params = {
        page,
        per_page: perPage,
        search: debouncedSearch || undefined,
    };

    const { list, total, lastPage, isLoading } = useActivityData(entityType, entityId, params);

    const from = total === 0 ? 0 : (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary-600" />
                    Activity History
                    {total > 0 && (
                        <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            {total}
                        </span>
                    )}
                </h3>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search activity..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 rounded-xl h-20" />
                    ))}
                </div>
            )}

            {/* Empty */}
            {!isLoading && list.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 font-medium">No activity found</p>
                    {debouncedSearch && (
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search term</p>
                    )}
                </div>
            )}

            {/* Log */}
            {!isLoading && list.length > 0 && (
                <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                    {list.map((Log, idx) => (
                        <div key={Log.id ?? idx} className="relative pl-8">
                            {/* Log dot */}
                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${typeColor(Log.type)}`} />

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                                {/* Top row */}
                                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        {/* Actor avatar */}
                                        <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {Log.actor?.initials ?? <UserIcon className="w-3 h-3" />}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {Log.actor?.name ?? 'System'}
                                            </span>
                                            <span className="text-gray-500 text-sm"> {Log.action}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span title={new Date(Log.timestamp).toLocaleString()}>{Log.timestamp_human}</span>
                                        </span>
                                        <span className={`capitalize px-2 py-0.5 rounded-full font-medium text-white text-[10px] ${typeColor(Log.type)}`}>
                                            {Log.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Target */}
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Target: <span className="font-medium text-gray-800 dark:text-gray-200">{Log.target_name}</span>
                                </p>

                                {/* IP / metadata */}
                                {Log.metadata?.ip_address && (
                                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                        <Monitor className="w-3 h-3" />
                                        {Log.metadata.ip_address}
                                    </div>
                                )}

                                {/* Changes */}
                                <ChangesDetail changes={Log.changes} />
                            </div>
                        </div>
                    ))}
                </div>
            )
            }

            {/* Pagination */}
            {
                !isLoading && total > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500">
                            Showing {from}–{to} of {total} activities
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: lastPage }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === lastPage || Math.abs(p - page) <= 2)
                                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) =>
                                    p === '...' ? (
                                        <span key={`dot-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p as number)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition ${page === p
                                                ? 'bg-primary-600 text-white shadow'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                )
                            }
                            <button
                                onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                                disabled={page >= lastPage}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
