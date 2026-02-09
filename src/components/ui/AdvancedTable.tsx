import React, { useState } from 'react';
import { Eye, EyeOff, LayoutGrid } from 'lucide-react';
import { Button } from './Button';

export interface Column {
    id: string;
    title: string;
    accessor: string;
    width?: number;
    render?: (row: any) => React.ReactNode;
}

interface Row {
    id: string;
    [key: string]: any;
}

interface AdvancedTableProps {
    initialColumns: Column[];
    initialData: Row[];
    title?: string;
}

export const AdvancedTable = ({ initialColumns, initialData, title }: AdvancedTableProps) => {

    const [visibleColumnIds, setVisibleColumnIds] = useState<Set<string>>(() =>
        new Set(initialColumns.map(col => col.id))
    );
    const [showColumnMenu, setShowColumnMenu] = useState(false);

    const toggleColumnVisibility = (colId: string) => {
        const newVisibleIds = new Set(visibleColumnIds);
        if (newVisibleIds.has(colId)) {

            if (newVisibleIds.size > 1) {
                newVisibleIds.delete(colId);
            }
        } else {
            newVisibleIds.add(colId);
        }
        setVisibleColumnIds(newVisibleIds);
    };

    const visibleColumns = initialColumns.filter(col => visibleColumnIds.has(col.id));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">

            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                <h3 className="text-lg font-semibold text-gray-800">{title || 'Data Table'}</h3>


                <div className="relative">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowColumnMenu(!showColumnMenu)}
                        className="flex items-center gap-2"
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Columns
                    </Button>

                    {showColumnMenu && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-2">
                            <div className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Toggle Columns</div>
                            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                                {initialColumns.map(col => (
                                    <button
                                        key={col.id}
                                        onClick={() => toggleColumnVisibility(col.id)}
                                        className={`
                                            flex items-center justify-between px-2 py-1.5 text-sm rounded-md w-full text-left transition-colors
                                            ${visibleColumnIds.has(col.id) ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'}
                                        `}
                                    >
                                        <span>{col.title}</span>
                                        {visibleColumnIds.has(col.id) ? (
                                            <Eye className="w-3.5 h-3.5" />
                                        ) : (
                                            <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>


            <div className="overflow-x-auto relative flex-1 w-full">
                <table className="w-full text-left border-collapse min-w-max">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold sticky top-0 z-20 shadow-sm">
                        <tr>
                            {visibleColumns.map((col, index) => (
                                <th
                                    key={col.id}
                                    className={`
                                        p-4 border-b border-gray-200 whitespace-nowrap bg-gray-50
                                        ${index === 0 ? 'sticky left-0 z-30 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]' : ''}
                                    `}
                                    style={{ width: col.width }}
                                >
                                    {col.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {initialData.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                {visibleColumns.map((col, index) => (
                                    <td
                                        key={`${row.id}-${col.id}`}
                                        className={`
                                            p-4 whitespace-nowrap bg-white border-b border-gray-100
                                            ${index === 0 ? 'sticky left-0 z-10 font-medium text-gray-900 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]' : 'text-gray-600'}
                                        `}
                                    >
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {initialData.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        No data available
                    </div>
                )}
            </div>

            {showColumnMenu && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setShowColumnMenu(false)}
                />
            )}
        </div>
    );
};
