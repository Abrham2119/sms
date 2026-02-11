
import {
    ArrowUpDown,
    ChevronDown,
    ChevronUp,
    Search
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Input } from '../ui/Input';
import { Pagination } from './Pagination';

export interface Column<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    searchable?: boolean;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchPlaceholder?: string;
    initialItemsPerPage?: number;
    wrapperClassName?: string;
    renderCollapsible?: (item: T) => React.ReactNode;
    // Server-side support
    serverSide?: boolean;
    totalItems?: number;
    currentPage?: number;
    itemsPerPage?: number;
    onPageChange?: (page: number) => void;
    onItemsPerPageChange?: (n: number) => void;
    onSearchChange?: (query: string) => void;
    onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
    loading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    searchPlaceholder = "Search...",
    initialItemsPerPage = 10,
    wrapperClassName = "",
    renderCollapsible,
    serverSide = false,
    totalItems: externalTotalItems,
    currentPage: externalCurrentPage,
    itemsPerPage: externalItemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    onSearchChange,
    onSortChange,
    loading
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [internalCurrentPage, setInternalCurrentPage] = useState(1);
    const [internalItemsPerPage, setInternalItemsPerPage] = useState(initialItemsPerPage);
    const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());

    const currentPage = serverSide ? (externalCurrentPage ?? 1) : internalCurrentPage;
    const itemsPerPage = serverSide ? (externalItemsPerPage ?? initialItemsPerPage) : internalItemsPerPage;

    const setCurrentPage = (page: number) => {
        if (serverSide) {
            onPageChange?.(page);
        } else {
            setInternalCurrentPage(page);
        }
    };

    const setItemsPerPage = (n: number) => {
        if (serverSide) {
            onItemsPerPageChange?.(n);
        } else {
            setInternalItemsPerPage(n);
        }
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        if (serverSide) {
            onSortChange?.(key, direction);
        }
    };

    const filteredAndSortedData = useMemo(() => {
        if (serverSide) return data;
        let processedData = [...data];

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            processedData = processedData.filter(item =>
                columns.some(col => {
                    if (col.searchable === false) return false;
                    const value = (item as any)[col.key];
                    return String(value).toLowerCase().includes(lowerQuery);
                })
            );
        }

        if (sortConfig) {
            processedData.sort((a, b) => {
                const aValue = (a as any)[sortConfig.key];
                const bValue = (b as any)[sortConfig.key];

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return processedData;
    }, [data, searchQuery, sortConfig, columns, serverSide]);

    const totalItems = serverSide ? (externalTotalItems ?? data.length) : filteredAndSortedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedData = serverSide ? data : filteredAndSortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleRow = (id: string | number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const handleSearch = (val: string) => {
        setSearchQuery(val);
        if (onSearchChange) {
            onSearchChange(val);
        }
        setCurrentPage(1);
    };

    return (
        <div className={`space-y-4 ${wrapperClassName} `}>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <button className="flex items-center gap-1 font-semibold hover:text-gray-900">
                        <LayoutDashboard className="w-4 h-4" />
                        {itemsPerPage} rows
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>
                    <button className="flex items-center gap-1 font-semibold hover:text-gray-900">
                        <Columns className="w-4 h-4" />
                        {columns.length} columns
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-500">Search</span>
                    </div>
                </div>
            </div> */}

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                {renderCollapsible && <th className="w-10 px-4 py-3"></th>}
                                {columns.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                        onClick={() => col.sortable && handleSort(String(col.key))}
                                    >
                                        <div className="flex items-center gap-2">
                                            {col.label}
                                            {col.sortable && sortConfig?.key === col.key && (
                                                sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                            )}
                                            {col.sortable && sortConfig?.key !== col.key && (
                                                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length + (renderCollapsible !== undefined ? 1 : 0)} className="px-6 py-8 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                                            <span className="text-gray-500">Loading data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <tr
                                            className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors ${renderCollapsible ? 'cursor-pointer' : ''}`}
                                            onClick={() => renderCollapsible && toggleRow(item.id)}
                                        >
                                            {renderCollapsible && (
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleRow(item.id);
                                                        }}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-transform duration-200"
                                                        style={{ transform: expandedRows.has(item.id) ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                                                    >
                                                        <ChevronDown className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            )}
                                            {columns.map((col) => (
                                                <td key={`${item.id}-${String(col.key)}`} className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                    {col.render ? col.render(item) : (item as any)[col.key]}
                                                </td>
                                            ))}
                                        </tr>
                                        {renderCollapsible && (
                                            <tr className="bg-gray-50/30 dark:bg-gray-900/20">
                                                <td colSpan={columns.length + 1} className="p-0 border-none">
                                                    <div className={`collapsible-wrapper ${expandedRows.has(item.id) ? 'open' : ''}`}>
                                                        <div className="collapsible-inner">
                                                            <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700 shadow-inner">
                                                                {renderCollapsible(item)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + (renderCollapsible !== undefined ? 1 : 0)} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No results found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
                />
            </div>
        </div>
    );
}
