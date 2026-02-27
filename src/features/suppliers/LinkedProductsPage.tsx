import { Eye, Link2Off, Package, Plus } from "lucide-react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import type { Column } from "../../components/table/DataTable";
import { DataTable } from "../../components/table/DataTable";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EntityDetailModal } from "../../components/ui/EntityDetailModal";
import type { Product } from "../../types";
import { MyProductLinkingModal } from "./components/MyProductLinkingModal";
import { useMyLinkedProducts, useMyProfile, useUnlinkMyProduct } from "./hooks/useSupplier";
const LinkedProductsPageContent = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
    const [unlinkingProduct, setUnlinkingProduct] = useState<Product | null>(null);

    const { data: profile } = useMyProfile();
    const supplierId = profile?.supplier_profile?.id || "";

    const { data: productsData, isLoading } = useMyLinkedProducts(supplierId, {
        page,
        per_page: perPage,
        search
    });

    const unlinkMutation = useUnlinkMyProduct();
    const handleUnlink = async () => {
        if (unlinkingProduct) {
            await unlinkMutation.mutateAsync({ supplierId, productId: unlinkingProduct.id });
            setUnlinkingProduct(null);
        }
    };

    const products = productsData?.data || [];

    const columns: Column<Product>[] = [
        {
            key: 'name',
            label: 'Product Name',
            sortable: true,
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
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 border border-primary-100 dark:border-primary-800">
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
            key: 'is_active',
            label: 'Status',
            render: (p) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.is_active
                    ? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                    {p.is_active ? "Active" : "Inactive"}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (p) => (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setViewingProduct(p)}>
                        <Eye className="w-4 h-4 text-primary-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                        onClick={(e) => { e.stopPropagation(); setUnlinkingProduct(p); }}
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
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                        Linked Products
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">
                        Products linked to your supplier account
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsLinkingModalOpen(true)}
                        className="whitespace-nowrap bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl px-6 shadow-lg shadow-primary-200 dark:shadow-none"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Link Products
                    </Button>
                </div>
            </div>

            {/* Table */}
            <DataTable
                data={products}
                columns={columns}
                searchPlaceholder="Search linked products..."
                serverSide={true}
                totalItems={productsData?.total || 0}
                currentPage={page}
                itemsPerPage={perPage}
                onPageChange={setPage}
                onItemsPerPageChange={(n) => {
                    setPerPage(n);
                    setPage(1);
                }}
                onSearchChange={setSearch}
                loading={isLoading}
            />

            {/* Product Linking Modal */}
            <MyProductLinkingModal
                open={isLinkingModalOpen}
                onClose={() => setIsLinkingModalOpen(false)}
                supplierId={supplierId}
            />

            {/* Product Detail Modal */}
            <EntityDetailModal
                isOpen={!!viewingProduct}
                onClose={() => setViewingProduct(null)}
                title="Product Details"
                sections={[
                    {
                        title: "Product Information",
                        fields: [
                            { label: "Product Name", value: viewingProduct?.name },
                            { label: "Category", value: viewingProduct?.category?.name || 'Uncategorized' },
                            { label: "Status", value: viewingProduct?.is_active ? "Active" : "Inactive" },
                            { label: "Price", value: viewingProduct?.price ? `$${viewingProduct.price.toFixed(2)}` : '-' },
                            { label: "Created At", value: (viewingProduct as any)?.created_at ? new Date((viewingProduct as any).created_at).toLocaleDateString() : '-' },
                            { label: "Description", value: (viewingProduct as any)?.description || 'No description provided.' },
                        ]
                    }
                ]}
            />

            {/* Unlink Confirmation Dialog */}
            <ConfirmDialog
                open={!!unlinkingProduct}
                onClose={() => setUnlinkingProduct(null)}
                onConfirm={handleUnlink}
                title="Unlink Product?"
                description={`Are you sure you want to remove "${unlinkingProduct?.name}" from your linked products?`}
                confirmText="Unlink"
                variant="danger"
                isLoading={unlinkMutation.isPending}
            />

            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export const LinkedProductsPage = () => {
    return <LinkedProductsPageContent />;
};

export default LinkedProductsPage;
