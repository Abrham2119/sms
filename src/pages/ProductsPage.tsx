import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Product, Category } from "../types";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import { DataTable } from "../components/table/DataTable";
import type { Column } from "../components/table/DataTable";
import { toast } from "react-toastify";

export const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Pagination & Search state
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { register, handleSubmit, reset, setValue } = useForm<{
        name: string;
        category_id: string;
        description: string;
        is_active: string; // handling as string for select "true"/"false" then converting
    }>();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getAll({
                page,
                per_page: 20,
                search: debouncedSearch
            });
            setProducts(response.data);
            setTotalItems(response.total);
            setPage(response.current_page);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            // Fetch validation needs all categories, but for dropdown we might paginate?
            // User requested "fetch and display a dropdown of all categories".
            // We'll fetch a larger number or just the first page if too many.
            // For now, assuming < 100 categories or just fetching page 1 is enough for the demo.
            const response = await categoryService.getAll({ per_page: 100 });
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, debouncedSearch]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = () => {
        setEditingProduct(null);
        reset({ name: "", category_id: "", description: "", is_active: "true" });
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setValue("name", product.name);
        setValue("category_id", product.category_id);
        setValue("description", product.description);
        setValue("is_active", product.is_active ? "true" : "false");
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await productService.delete(id);
            toast.success("Product deleted");
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete product");
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                is_active: data.is_active === "true",
            };

            if (editingProduct) {
                await productService.update(editingProduct.id, payload);
                toast.success("Product updated");
            } else {
                await productService.create(payload);
                toast.success("Product created");
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save product");
        }
    };

    const columns: Column<Product>[] = [
        { key: 'name', label: 'Name', sortable: true, searchable: true },
        {
            key: 'category',
            label: 'Category',
            render: (p) => p.category?.name || '-'
        },
        {
            key: 'description',
            label: 'Description',
            render: (p) => <span className="max-w-xs truncate block">{p.description || '-'}</span>
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (p) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
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
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                        onClick={() => handleDelete(p.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={handleCreate} className="whitespace-nowrap">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
                <DataTable
                    data={products}
                    columns={columns}
                    searchPlaceholder="Search products..."
                    serverSide={true}
                    totalItems={totalItems}
                    currentPage={page}
                    itemsPerPage={20}
                    onPageChange={setPage}
                    onItemsPerPageChange={() => {
                        setPage(1);
                    }}
                    onSearchChange={setSearch}
                    loading={loading}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? "Edit Product" : "New Product"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Name"
                        {...register("name", { required: "Name is required" })}
                        placeholder="Product Name"
                    />

                    <Select
                        label="Category"
                        {...register("category_id", { required: "Category is required" })}
                        options={[{ value: "", label: "Select Category" }, ...categoryOptions]}
                    />

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Description</label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="Product description"
                        />
                    </div>

                    <Select
                        label="Status"
                        {...register("is_active")}
                        options={[{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }]}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            {editingProduct ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProductsPage;
