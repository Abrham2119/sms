import { useState } from 'react';
import type { Category } from '../../../types';
import { Edit2, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface CategoryTableProps {
    categories: Category[];
    loading: boolean;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({ categories, loading, onEdit, onDelete }) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedCategories(newExpanded);
    };

    const renderCategoryRow = (category: Category, level = 0): React.ReactNode => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedCategories.has(category.id);

        return (
            <>
                <tr key={category.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
                            {hasChildren ? (
                                <button
                                    onClick={() => toggleExpand(category.id)}
                                    className="mr-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                >
                                    {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                                </button>
                            ) : (
                                <span className="w-6 mr-2"></span>
                            )}
                            <span className="font-medium text-gray-900 dark:text-gray-100">{category.name}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-gray-600 dark:text-gray-400 text-sm italic">
                            {category.description || '-'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
                                <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                                onClick={() => onDelete(category)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </td>
                </tr>
                {hasChildren && isExpanded && category.children!.map((child) => renderCategoryRow(child, level + 1))}
            </>
        );
    };

    if (loading && categories.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Name</th>
                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Description</th>
                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {categories.length > 0 ? (
                            categories.map((category) => renderCategoryRow(category))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
