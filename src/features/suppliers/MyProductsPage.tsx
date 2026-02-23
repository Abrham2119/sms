import { Eye, Package } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import type { Column } from "../../components/table/DataTable";
import { DataTable } from "../../components/table/DataTable";
import { Button } from "../../components/ui/Button";
import type { Product } from "../../types";
import { useMyProducts } from "./hooks/useSupplier";

const MyProductsPageContent = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    // Fetch supplier's own products using the new endpoint
    const { data: productsData, isLoading } = useMyProducts({
        page,
        per_page: perPage,
        search
    });

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
                <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/my-products/${p.id}`)}>
                        <Eye className="w-4 h-4 text-primary-600" />
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
                        My Products
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">
                        View and manage your product catalog
                    </p>
                </div>
            </div>

            {/* Table */}
            <DataTable
                data={products}
                columns={columns}
                searchPlaceholder="Search products..."
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

            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export const MyProductsPage = () => {
    return <MyProductsPageContent />;
};

export default MyProductsPage;
