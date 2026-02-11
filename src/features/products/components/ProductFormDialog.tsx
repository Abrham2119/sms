import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Product, Category } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

interface ProductFormDialogProps {
    open: boolean;
    onClose: () => void;
    initialData?: Product | null;
    categories: Category[];
    onSubmit: (data: any) => Promise<void>;
}

export const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
    open,
    onClose,
    initialData,
    categories,
    onSubmit
}) => {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<{
        name: string;
        category_id: string;
        description: string;
        is_active: string;
    }>();

    useEffect(() => {
        if (open) {
            if (initialData) {
                setValue('name', initialData.name);
                setValue('category_id', initialData.category_id);
                setValue('description', initialData.description);
                setValue('is_active', initialData.is_active ? 'true' : 'false');
            } else {
                reset({ name: '', category_id: '', description: '', is_active: 'true' });
            }
        }
    }, [open, initialData, reset, setValue]);

    const handleFormSubmit = async (data: any) => {
        await onSubmit({
            ...data,
            is_active: data.is_active === 'true'
        });
        onClose();
    };

    const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={initialData ? 'Edit Product' : 'Add Product'}
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <Input
                    label="Name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Product Name"
                    error={errors.name?.message}
                />

                <Select
                    label="Category"
                    {...register("category_id", { required: "Category is required" })}
                    options={[{ value: "", label: "Select Category" }, ...categoryOptions]}
                    error={errors.category_id?.message}
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

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {initialData ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
