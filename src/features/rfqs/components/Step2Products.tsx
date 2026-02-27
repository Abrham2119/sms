import React, { useState, useMemo } from 'react';
import { Search, Check, X } from 'lucide-react';
import type { Product } from '../../../types';
import type { RFQProductFormData } from '../../../utils/rfqSchemas';

interface Step2ProductsProps {
    products: Product[];
    onNext: (products: RFQProductFormData[]) => Promise<void>;
    onBack: () => void;
    isLoading: boolean;
    initialData?: RFQProductFormData[];
    readOnly?: boolean;
    initialProductNames?: Record<string, string>;
}

export const Step2Products: React.FC<Step2ProductsProps> = ({
    products,
    onNext,
    onBack,
    isLoading,
    initialData,
    readOnly,
    initialProductNames
}) => {
    const [selectedProducts, setSelectedProducts] = useState<RFQProductFormData[]>(initialData || []);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [productNames, setProductNames] = useState<Record<string, string>>(initialProductNames || {});

    // Single item editing state (for the table below)
    const [editQty, setEditQty] = useState<number>(1);
    const [editSpecs, setEditSpecs] = useState<string>('');

    // Bulk selection state
    const [searchTerm, setSearchTerm] = useState('');
    const [checkedProductIds, setCheckedProductIds] = useState<Set<string>>(new Set());

    // Update product names cache
    React.useEffect(() => {
        if (products.length > 0) {
            const newNames: Record<string, string> = {};
            products.forEach(p => {
                newNames[p.id] = p.name;
            });
            setProductNames(prev => ({ ...prev, ...newNames }));
        }
    }, [products]);

    const filteredCatalog = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const toggleProductCheck = (id: string) => {
        const newSet = new Set(checkedProductIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setCheckedProductIds(newSet);
    };

    const handleBulkAdd = () => {
        const newItems: RFQProductFormData[] = Array.from(checkedProductIds)
            .filter(id => !selectedProducts.some(sp => sp.product_id === id))
            .map(id => ({
                product_id: id,
                quantity: 1,
                specifications: ''
            }));

        if (newItems.length > 0) {
            setSelectedProducts([...selectedProducts, ...newItems]);
        }
        setCheckedProductIds(new Set());
    };

    const handleEditRow = (p: RFQProductFormData, index: number) => {
        setEditingIndex(index);
        setEditQty(p.quantity);
        setEditSpecs(p.specifications || '');
    };

    const handleSaveEdit = () => {
        if (editingIndex === null) return;
        const updated = [...selectedProducts];
        updated[editingIndex] = {
            ...updated[editingIndex],
            quantity: editQty,
            specifications: editSpecs
        };
        setSelectedProducts(updated);
        setEditingIndex(null);
    };

    const handleRemoveProduct = (index: number) => {
        setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
    };

    const getProductName = (id: string) => {
        return productNames[id] || products.find(p => p.id === id)?.name || 'Unknown Product';
    };

    return (
        <div className="space-y-6">
            {!readOnly && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <h3 className="text-sm font-semibold text-gray-700">Add Products</h3>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500 bg-white"
                            />
                        </div>
                    </div>

                    <div className="border border-gray-300 rounded-md overflow-hidden bg-white mb-4">
                        <div className="max-h-52 overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 bg-white">
                                    <tr>
                                        <th className="px-3 py-2 w-10">
                                            <input
                                                type="checkbox"
                                                checked={filteredCatalog.length > 0 && filteredCatalog.every(p => checkedProductIds.has(p.id))}
                                                onChange={(e) => {
                                                    const newSet = new Set(checkedProductIds);
                                                    if (e.target.checked) filteredCatalog.forEach(p => newSet.add(p.id));
                                                    else filteredCatalog.forEach(p => newSet.delete(p.id));
                                                    setCheckedProductIds(newSet);
                                                }}
                                                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                                            />
                                        </th>
                                        <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">Product Name</th>
                                        <th className="px-3 py-2 text-xs font-bold text-gray-500 uppercase text-right">Category</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredCatalog.length > 0 ? (
                                        filteredCatalog.map(p => (
                                            <tr
                                                key={p.id}
                                                onClick={() => toggleProductCheck(p.id)}
                                                className={`hover:bg-gray-50 cursor-pointer ${checkedProductIds.has(p.id) ? 'bg-primary-50' : ''}`}
                                            >
                                                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedProductIds.has(p.id)}
                                                        onChange={() => toggleProductCheck(p.id)}
                                                        className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-gray-900 font-medium">{p.name}</td>
                                                <td className="px-3 py-2 text-right text-xs text-gray-400">{p.category?.name || '---'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-3 py-8 text-center text-gray-400 italic">No products found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                            {checkedProductIds.size} products selected
                        </span>
                        <button
                            onClick={handleBulkAdd}
                            disabled={checkedProductIds.size === 0}
                            className="bg-primary-500 text-black hover:bg-primary-600 px-4 py-2 rounded-md text-sm font-bold transition-colors disabled:opacity-50"
                        >
                            Add to List
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Attached Products</h3>
                <div className="border rounded-md overflow-hidden bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
                                {!readOnly && (
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {selectedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={readOnly ? 3 : 4} className="px-4 py-12 text-center text-sm text-gray-400 italic">
                                        No products added yet.
                                    </td>
                                </tr>
                            ) : (
                                selectedProducts.map((p, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                            {getProductName(p.product_id)}
                                            <div className="text-[10px] text-gray-400 mt-0.5">ID: {p.product_id.slice(0, 8).toUpperCase()}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {editingIndex === index ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={editQty}
                                                    onChange={(e) => setEditQty(Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-16 p-1 border rounded text-center focus:ring-1 focus:ring-primary-500"
                                                />
                                            ) : (
                                                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-bold">{p.quantity}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 italic max-w-xs truncate">
                                            {editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    value={editSpecs}
                                                    onChange={(e) => setEditSpecs(e.target.value)}
                                                    className="w-full p-1 border rounded focus:ring-1 focus:ring-primary-500"
                                                />
                                            ) : (
                                                p.specifications || '-'
                                            )}
                                        </td>
                                        {!readOnly && (
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-3">
                                                    {editingIndex === index ? (
                                                        <>
                                                            <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-700">
                                                                <Check size={16} />
                                                            </button>
                                                            <button onClick={() => setEditingIndex(null)} className="text-gray-400 hover:text-gray-600">
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditRow(p, index)}
                                                                className="text-primary-600 hover:text-primary-700 text-xs font-bold"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveProduct(index)}
                                                                className="text-red-500 hover:text-red-700 text-xs font-bold"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-between gap-3 pt-6 border-t border-gray-100">
                <button
                    onClick={onBack}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                >
                    <X size={16} /> Previous
                </button>
                <button
                    onClick={() => onNext(selectedProducts)}
                    disabled={selectedProducts.length === 0 || isLoading}
                    className="px-8 py-2 bg-primary-500 text-black rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors font-bold"
                >
                    {isLoading ? 'Saving...' : 'Next'}
                </button>
            </div>
        </div>
    );
};
