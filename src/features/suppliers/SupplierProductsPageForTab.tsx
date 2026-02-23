import {
    Link2Off,
    Package,
    Plus,
    Eye
} from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Column } from '../../components/table/DataTable';
import { DataTable } from '../../components/table/DataTable';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { Product } from '../../types';
import { ProductLinkingModal } from './components/ProductLinkingModal';
import {
    useLinkedProducts,
    useUnlinkProduct,
} from './hooks/useSupplier';

interface SupplierProductsPageProps {
    supplierId?: string;
}

export const SupplierProductsPageForTab = ({ supplierId: propSupplierId }: SupplierProductsPageProps = {}) => {
    const { id: paramId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const id = propSupplierId || paramId;
    if (!id) return <div>Invalid Supplier ID</div>;
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
    const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
    const [unlinkingProducts, setUnlinkingProducts] = useState<Product[] | null>(null);

    // const { data: supplier } = useSupplier(id!);
    const { data: productsData, isLoading } = useLinkedProducts(id, {
        page,
        per_page: perPage
    });

    const unlinkMutation = useUnlinkProduct();

    const handleUnlink = async () => {
        if (unlinkingProducts) {
            await unlinkMutation.mutateAsync({
                supplierId: id!,
                productIds: unlinkingProducts.map(p => p.id)
            });
            setUnlinkingProducts(null);
            setSelectedIds(new Set());
        }
    };

    const columns: Column<Product>[] = [
        {
            key: 'name',
            label: 'Product Name',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
                        <span className="text-xs text-gray-500">ID: {item.id.slice(0, 8)}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'category',
            label: 'Category',
            render: (item) => (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                    {item.category?.name || 'Uncategorized'}
                </span>
            )
        },
        {
            key: 'price',
            label: 'Price',
            render: (item) => (
                <span className="font-mono text-gray-600 dark:text-gray-400">
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item) => (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                        onClick={(e) => { e.stopPropagation(); navigate(`/products/${item.id}`); }}
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => { e.stopPropagation(); setUnlinkingProducts([item]); }}
                        title="Unlink Product"
                    >
                        <Link2Off className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Manage Linked Products
                    </h1>
                    {selectedIds.size > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedIds.size} product(s) selected
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            const products = productsData?.data.filter(p => selectedIds.has(p.id)) || [];
                            setUnlinkingProducts(products);
                        }}
                        disabled={selectedIds.size === 0}
                        className={`text-red-600 border-red-200 hover:bg-red-50 ${selectedIds.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Unlink Selected
                    </Button>
                    <Button
                        onClick={() => setIsLinkingModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl px-6 py-2 shadow-lg shadow-primary-200 dark:shadow-none flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        Link New Products
                    </Button>
                </div>
            </div>

            {/* Table */}
            <DataTable
                data={productsData?.data || []}
                columns={columns}
                loading={isLoading}
                serverSide
                totalItems={productsData?.total || 0}
                currentPage={page}
                itemsPerPage={perPage}
                onPageChange={setPage}
                onItemsPerPageChange={setPerPage}
                searchPlaceholder="Search linked products..."
                enableSelection
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
            />

            {/* Modals */}
            <ProductLinkingModal
                open={isLinkingModalOpen}
                onClose={() => setIsLinkingModalOpen(false)}
                supplierId={id!}
            />

            <ConfirmDialog
                open={!!unlinkingProducts}
                onClose={() => setUnlinkingProducts(null)}
                onConfirm={handleUnlink}
                title={unlinkingProducts && unlinkingProducts.length > 1 ? "Bulk Unlink Products?" : "Unlink Product?"}
                description={
                    unlinkingProducts && unlinkingProducts.length > 1
                        ? `Are you sure you want to remove ${unlinkingProducts.length} products from this supplier's catalog?`
                        : `Are you sure you want to remove "${unlinkingProducts?.[0]?.name}" from this supplier's catalog?`
                }
                confirmText="Unlink"
                variant="danger"
                isLoading={unlinkMutation.isPending}
            />
        </div>
    );
};

export default SupplierProductsPageForTab;
