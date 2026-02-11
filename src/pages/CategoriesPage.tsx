import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Category } from "../types";
import { categoryService } from "../services/categoryService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select"; // Assuming Select exists and works similarly
import { Edit2, Trash2, Plus } from "lucide-react";
import { DataTable } from "../components/table/DataTable";
import type { Column } from "../components/table/DataTable";
import { toast } from "react-toastify";

export const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [page, setPage] = useState(1); // Added page state

    const { register, handleSubmit, reset, setValue } = useForm<{ name: string; parent_id: string | null }>();

    const fetchCategories = async (currentPage = 1) => {
        setLoading(true);
        try {
            const response = await categoryService.getAll({ page: currentPage, per_page: 20 }); // Removed searchTerm
            setCategories(response.data);
            setPage(response.current_page);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(page); // Pass page to fetchCategories
    }, [page]); // Removed searchTerm from dependency array

    const handleCreate = () => {
        setEditingCategory(null);
        reset({ name: "", parent_id: "null" }); // "null" string for select
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setValue("name", category.name);
        setValue("parent_id", category.parent_id || "null");
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await categoryService.delete(id);
            toast.success("Category deleted");
            fetchCategories(page);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete category");
        }
    };

    const onSubmit = async (data: { name: string; parent_id: string | null }) => {
        try {
            const payload = {
                name: data.name,
                parent_id: data.parent_id === "null" ? null : data.parent_id,
            };

            if (editingCategory) {
                await categoryService.update(editingCategory.id, payload);
                toast.success("Category updated");
            } else {
                await categoryService.create(payload);
                toast.success("Category created");
            }
            setIsModalOpen(false);
            fetchCategories(page);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save category");
        }
    };

    const columns: Column<Category>[] = [
        { key: 'name', label: 'Name', sortable: true, searchable: true },
        {
            key: 'description',
            label: 'Description',
            render: (c) => <span className="italic text-gray-500">{c.description || '-'}</span>
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (c) => (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(c)}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger-600 hover:text-danger-700"
                        onClick={() => handleDelete(c.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    const parentOptions = categories.map(c => ({ label: c.name, value: c.id }));


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
                <DataTable
                    data={categories}
                    columns={columns}
                    searchPlaceholder="Search categories..."
                    serverSide={true}
                    totalItems={categories.length} // Simplified total for this page structure
                    currentPage={page}
                    itemsPerPage={20}
                    onPageChange={(p) => fetchCategories(p)}
                    loading={loading}
                    onItemsPerPageChange={() => { // Added onItemsPerPageChange
                        setPage(1);
                    }}
                    renderCollapsible={(c) => (
                        <div className="pl-8 py-2">
                            {c.children && c.children.length > 0 ? (
                                <DataTable
                                    data={c.children}
                                    columns={columns.filter(col => col.key !== 'actions')}
                                    wrapperClassName="border-none shadow-none"
                                />
                            ) : (
                                <p className="text-xs text-gray-400 italic">No sub-categories</p>
                            )}
                        </div>
                    )}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? "Edit Category" : "New Category"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Name"
                        {...register("name", { required: "Name is required" })}
                        placeholder="Category Name"
                    />

                    <div>
                        <Select
                            label="Parent Category"
                            {...register("parent_id")}
                            options={[{ value: "null", label: "None" }, ...parentOptions]}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            {editingCategory ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CategoriesPage;
