import React, { useState } from 'react';
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
    const [currentProduct, setCurrentProduct] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [specs, setSpecs] = useState<string>('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [productNames, setProductNames] = useState<Record<string, string>>(initialProductNames || {});

    // Update product names cache when products list changes
    React.useEffect(() => {
        if (products.length > 0) {
            const newNames: Record<string, string> = {};
            products.forEach(p => {
                newNames[p.id] = p.name;
            });
            setProductNames(prev => ({ ...prev, ...newNames }));
        }
    }, [products]);

    const handleAddProduct = () => {
        if (!currentProduct) return;

        const newProduct: RFQProductFormData = {
            product_id: currentProduct,
            quantity,
            specifications: specs
        };

        if (editingIndex !== null) {
            setSelectedProducts(selectedProducts.map((p, i) => i === editingIndex ? newProduct : p));
            setEditingIndex(null);
        } else {
            setSelectedProducts([...selectedProducts, newProduct]);
        }

        setCurrentProduct('');
        setQuantity(1);
        setSpecs('');
    };

    const handleEditProduct = (p: RFQProductFormData, index: number) => {
        setEditingIndex(index);
        setCurrentProduct(p.product_id);
        setQuantity(p.quantity);
        setSpecs(p.specifications || '');
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setCurrentProduct('');
        setQuantity(1);
        setSpecs('');
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
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Add Products</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Product</label>
                            <select
                                value={currentProduct}
                                onChange={(e) => setCurrentProduct(e.target.value)}
                                className="w-full p-2 border rounded-md text-sm"
                                disabled={editingIndex !== null} // Disable product selection when editing
                            >
                                <option value="">Select a product...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="w-full p-2 border rounded-md text-sm"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">&nbsp;</label>
                            <button
                                onClick={handleAddProduct}
                                disabled={!currentProduct}
                                className={`w-full p-2 text-black rounded-md text-sm font-medium transition-colors ${editingIndex !== null ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-primary-500 hover:bg-primary-600'
                                    } disabled:opacity-50`}
                            >
                                {editingIndex !== null ? 'Update Item' : 'Add to List'}
                            </button>
                            {editingIndex !== null && (
                                <button
                                    onClick={handleCancelEdit}
                                    className="w-full mt-2 p-2 border border-gray-300 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Specifications (Optional)</label>
                        <textarea
                            value={specs}
                            onChange={(e) => setSpecs(e.target.value)}
                            className="w-full p-2 border rounded-md text-sm h-16"
                            placeholder="Technical details, color, size, etc."
                        />
                    </div>
                </div>
            )}

            <div className="border rounded-lg overflow-hidden">
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
                                <td colSpan={readOnly ? 3 : 4} className="px-4 py-8 text-center text-sm text-gray-400">
                                    No products added yet.
                                </td>
                            </tr>
                        ) : (
                            selectedProducts.map((p, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{getProductName(p.product_id)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{p.quantity}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 italic max-w-xs truncate">{p.specifications || '-'}</td>
                                    {!readOnly && (
                                        <td className="px-4 py-3 text-right flex justify-end gap-3">
                                            <button
                                                onClick={() => handleEditProduct(p, index)}
                                                className="text-black hover:text-primary-800 text-xs font-bold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleRemoveProduct(index)}
                                                className="text-red-500 hover:text-red-700 text-xs font-bold"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between gap-3 pt-4">
                <button
                    onClick={onBack}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Previous
                </button>
                <button
                    onClick={() => onNext(selectedProducts)}
                    disabled={selectedProducts.length === 0 || isLoading}
                    className="px-6 py-2 bg-primary-500 text-black rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
                >
                    {isLoading ? 'Saving...' : 'Next'}
                </button>
            </div>
        </div>
    );
};
