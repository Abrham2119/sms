import React, { useState, useEffect } from 'react';
import { Package, Check } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { DataTable } from '../../../components/table/DataTable';
import type { Column } from '../../../components/table/DataTable';
import { useProducts } from '../../products/hooks/useProduct';
import { useLinkProducts } from '../hooks/useSupplier';
import type { Product } from '../../../types';

interface ProductLinkingModalProps {
    open: boolean;
    onClose: () => void;
    supplierId: string;
}

export const ProductLinkingModal: React.FC<ProductLinkingModalProps> = ({
    open,
    onClose,
    supplierId
}) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const { data: productsData, isLoading } = useProducts({
        page,
        per_page: 10,
        search
    });

    const linkMutation = useLinkProducts();

    useEffect(() => {
        if (!open) {
            setSelectedIds(new Set());
            setSearch("");
            setPage(1);
        }
    }, [open]);

    const toggleProduct = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleLink = async () => {
        if (selectedIds.size > 0) {
            await linkMutation.mutateAsync({
                supplierId,
                productIds: Array.from(selectedIds)
            });
            onClose();
        }
    };

    const columns: Column<Product>[] = [
        {
            key: 'selection',
            label: '',
            render: (item) => (
                <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${selectedIds.has(item.id)
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-gray-300 dark:border-gray-600 bg-transparent'
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleProduct(item.id);
                    }}
                >
                    {selectedIds.has(item.id) && <Check className="w-3 h-3 text-white" />}
                </div>
            )
        },
        {
            key: 'name',
            label: 'Product',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        <Package className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{item.name}</span>
                </div>
            )
        },
        {
            key: 'id',
            label: 'ID',
            render: (item) => (
                <span className="text-xs font-mono text-gray-400 uppercase">{item.id.slice(0, 8)}</span>
            )
        }
    ];

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Link Products to Supplier"
            className="max-w-4xl w-full"
        >
            <div className="space-y-4 py-4">
                <DataTable
                    data={productsData?.data || []}
                    columns={columns}
                    loading={isLoading}
                    serverSide
                    totalItems={productsData?.total || 0}
                    currentPage={page}
                    itemsPerPage={10}
                    onPageChange={setPage}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search product catalog..."
                    wrapperClassName="min-h-[400px]"
                />

                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500">
                        {selectedIds.size} product(s) selected
                    </span>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose} className="rounded-xl px-6">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLink}
                            disabled={selectedIds.size === 0 || linkMutation.isPending}
                            isLoading={linkMutation.isPending}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl px-8 shadow-lg shadow-primary-200"
                        >
                            Link Selected Products
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
