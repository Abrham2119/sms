import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { UOM } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

interface UOMFormDialogProps {
    open: boolean;
    onClose: () => void;
    initialData?: UOM | null;
    onSubmit: (data: { name: string; abbreviation: string; description: string | null; is_active: boolean }) => Promise<void>;
}

export const UOMFormDialog: React.FC<UOMFormDialogProps> = ({
    open,
    onClose,
    initialData,
    onSubmit
}) => {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<{
        name: string;
        abbreviation: string;
        description: string;
        is_active: string;
    }>();

    useEffect(() => {
        if (open) {
            if (initialData) {
                setValue('name', initialData.name);
                setValue('abbreviation', initialData.abbreviation);
                setValue('description', initialData.description || '');
                setValue('is_active', initialData.is_active ? 'true' : 'false');
            } else {
                reset({ name: '', abbreviation: '', description: '', is_active: 'true' });
            }
        }
    }, [open, initialData, reset, setValue]);

    const handleFormSubmit = async (data: { name: string; abbreviation: string; description: string; is_active: string }) => {
        await onSubmit({
            name: data.name,
            abbreviation: data.abbreviation,
            description: data.description || null,
            is_active: data.is_active === 'true'
        });
        onClose();
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={initialData ? 'Edit Unit of Measurement' : 'Add Unit of Measurement'}
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <Input
                    label="Name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="e.g. Kilo Gram"
                    error={errors.name?.message}
                />

                <Input
                    label="Abbreviation"
                    {...register("abbreviation", { required: "Abbreviation is required" })}
                    placeholder="e.g. Kg"
                    error={errors.abbreviation?.message}
                />

                <Input
                    label="Description"
                    {...register("description")}
                    placeholder="Optional description"
                    error={errors.description?.message}
                />

                <Select
                    label="Status"
                    {...register("is_active")}
                    options={[
                        { label: 'Active', value: 'true' },
                        { label: 'Inactive', value: 'false' }
                    ]}
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
