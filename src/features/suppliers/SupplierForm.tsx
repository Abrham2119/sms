import { useForm } from 'react-hook-form';
import type { Supplier } from '../../types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

interface SupplierFormProps {
    initialData?: Supplier;
    onSubmit: (data: Omit<Supplier, 'id' | 'joinedDate' | 'rating'>) => void;
    onCancel: () => void;
}

export const SupplierForm = ({ initialData, onSubmit, onCancel }: SupplierFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<Omit<Supplier, 'id' | 'joinedDate' | 'rating'>>({
        defaultValues: initialData ? {
            companyName: initialData.companyName,
            contactPerson: initialData.contactPerson,
            email: initialData.email,
            phone: initialData.phone,
            address: initialData.address,
            status: initialData.status,
            category: initialData.category
        } : {
            status: 'active',
            category: 'electronics'
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Company Name"
                    {...register('companyName', { required: 'Company Name is required' })}
                    error={errors.companyName?.message}
                />
                <Input
                    label="Contact Person"
                    {...register('contactPerson', { required: 'Contact Person is required' })}
                    error={errors.contactPerson?.message}
                />
                <Input
                    label="Email"
                    type="email"
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                    error={errors.email?.message}
                />
                <Input
                    label="Phone"
                    {...register('phone', { required: 'Phone is required' })}
                    error={errors.phone?.message}
                />
                <Select
                    label="Category"
                    options={[
                        { value: 'electronics', label: 'Electronics' },
                        { value: 'furniture', label: 'Furniture' },
                        { value: 'office_supplies', label: 'Office Supplies' },
                        { value: 'services', label: 'Services' },
                        { value: 'other', label: 'Other' },
                    ]}
                    {...register('category')}
                />
                <Select
                    label="Status"
                    options={[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'blacklisted', label: 'Blacklisted' },
                    ]}
                    {...register('status')}
                />
            </div>

            <Textarea
                label="Address"
                {...register('address', { required: 'Address is required' })}
                error={errors.address?.message}
            />

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    {initialData ? 'Update Supplier' : 'Add Supplier'}
                </Button>
            </div>
        </form>
    );
};
