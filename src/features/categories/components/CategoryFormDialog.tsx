import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Category } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

interface CategoryFormDialogProps {
    open: boolean;
    onClose: () => void;
    initialData?: Category | null;
    categories: Category[]; // For parent selection
    onSubmit: (data: { name: string; parent_id: string | null; description?: string }) => Promise<void>;
}

export const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
    open,
    onClose,
    initialData,
    categories,
    onSubmit
}) => {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<{ name: string; parent_id: string; description: string }>();

    useEffect(() => {
        if (open) {
            if (initialData) {
                setValue('name', initialData.name);
                setValue('parent_id', initialData.parent_id || 'null');
                setValue('description', initialData.description || '');
            } else {
                reset({ name: '', parent_id: 'null', description: '' });
            }
        }
    }, [open, initialData, reset, setValue]);

    const handleFormSubmit = async (data: { name: string; parent_id: string; description: string }) => {
        await onSubmit({
            name: data.name,
            parent_id: data.parent_id === 'null' ? null : data.parent_id,
            description: data.description || undefined
        });
        onClose();
    };

    // Flatten categories for options (simple approach)
    // Ideally this should be a recursive flattening if deeper nesting is needed in dropdown
    const parentOptions = Array.isArray(categories)
        ? categories.map(c => ({ label: c.name, value: c.id }))
        : [];

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={initialData ? 'Edit Category' : 'Add Category'}
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <Input
                    label="Name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Category Name"
                    error={errors.name?.message}
                />

                <Select
                    label="Parent Category"
                    {...register("parent_id")}
                    options={[{ value: "null", label: "None" }, ...parentOptions]}
                />

                <Input
                    label="Description"
                    {...register("description")}
                    placeholder="Category Description (Optional)"
                    error={errors.description?.message}
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
