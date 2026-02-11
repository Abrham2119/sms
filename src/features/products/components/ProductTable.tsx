import type { Product } from '../../../types';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ProductTableProps {
    products: Product[];
    loading: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, loading, onEdit, onDelete }) => {
    if (loading && products.length === 0) {
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
                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Category</th>
                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{product.name}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        {product.category?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_active
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                            }`}>
                                            {product.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                                                onClick={() => onDelete(product)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
