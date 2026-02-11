import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { Supplier } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

interface SupplierFormDialogProps {
    open: boolean;
    onClose: () => void;
    initialData?: Supplier | null;
    onSubmit: (data: any) => Promise<void>;
}

export const SupplierFormDialog: React.FC<SupplierFormDialogProps> = ({
    open,
    onClose,
    initialData,
    onSubmit
}) => {
    const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Supplier>({
        defaultValues: {
            legal_name: '',
            trade_name: '',
            email: '',
            tin: '',
            website: '',
            status: 'active',
            contacts: [{ name: '', email: '', phone: '', role: '', is_primary: true }],
            addresses: [{ type: 'hq', country: 'Ethiopia', city: '', address_line1: '' }]
        }
    });

    const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
        control,
        name: "contacts"
    });

    const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({
        control,
        name: "addresses"
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                reset(initialData);
            } else {
                reset({
                    legal_name: '',
                    trade_name: '',
                    email: '',
                    tin: '',
                    website: '',
                    status: 'active',
                    contacts: [{ name: '', email: '', phone: '', role: '', is_primary: true }],
                    addresses: [{ type: 'hq', country: 'Ethiopia', city: '', address_line1: '' }]
                });
            }
        }
    }, [open, initialData, reset]);

    const handleFormSubmit = async (data: Supplier) => {
        await onSubmit(data);
        onClose();
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={initialData ? 'Edit Supplier' : 'Add Supplier'}
            className="max-w-5xl"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 border-b pb-2 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Legal Name"
                            {...register("legal_name", { required: "Legal name is required" })}
                            placeholder="e.g. Acme Corporation"
                            error={errors.legal_name?.message}
                        />
                        <Input
                            label="Trade Name"
                            {...register("trade_name", { required: "Trade name is required" })}
                            placeholder="e.g. Acme"
                            error={errors.trade_name?.message}
                        />
                        <Input
                            label="Email"
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            placeholder="supplier@example.com"
                            error={errors.email?.message}
                        />
                        <Input
                            label="TIN"
                            {...register("tin", { required: "TIN is required" })}
                            placeholder="Tax Identification Number"
                            error={errors.tin?.message}
                        />
                        <Input
                            label="Website"
                            {...register("website")}
                            placeholder="https://example.com"
                        />
                        <Select
                            label="Status"
                            {...register("status")}
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                                { value: 'suspended', label: 'Suspended' },
                                { value: 'blacklisted', label: 'Blacklisted' }
                            ]}
                        />
                    </div>
                </div>

                {/* Contacts */}
                <div>
                    <div className="flex items-center justify-between border-b pb-2 mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Contacts</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendContact({ name: '', email: '', phone: '', role: '', is_primary: false })}
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Contact
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {contactFields.map((field, index) => (
                            <div key={field.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg relative">
                                {contactFields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeContact(index)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-danger-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Input
                                        label="Name"
                                        {...register(`contacts.${index}.name` as const, { required: "Name is required" })}
                                        placeholder="Full Name"
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        {...register(`contacts.${index}.email` as const)}
                                        placeholder="contact@e.com"
                                    />
                                    <Input
                                        label="Phone"
                                        {...register(`contacts.${index}.phone` as const)}
                                        placeholder="+251..."
                                    />
                                    <Input
                                        label="Role"
                                        {...register(`contacts.${index}.role` as const)}
                                        placeholder="e.g Sales"
                                    />
                                </div>
                                <div className="mt-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            {...register(`contacts.${index}.is_primary` as const)}
                                            className="form-checkbox h-4 w-4 text-primary-600 rounded border-gray-300 transition duration-150 ease-in-out"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Primary Contact</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Addresses */}
                <div>
                    <div className="flex items-center justify-between border-b pb-2 mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Addresses</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendAddress({ type: 'hq', country: 'Ethiopia', city: '', address_line1: '' })}
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Address
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {addressFields.map((field, index) => (
                            <div key={field.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg relative">
                                {addressFields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeAddress(index)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-danger-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Select
                                        label="Type"
                                        {...register(`addresses.${index}.type` as const)}
                                        options={[
                                            { value: 'hq', label: 'Headquarters' },
                                            { value: 'warehouse', label: 'Warehouse' },
                                            { value: 'office', label: 'Office' }
                                        ]}
                                    />
                                    <Input
                                        label="Country"
                                        {...register(`addresses.${index}.country` as const)}
                                        placeholder="Ethiopia"
                                    />
                                    <Input
                                        label="City"
                                        {...register(`addresses.${index}.city` as const, { required: "City is required" })}
                                        placeholder="Addis Ababa"
                                    />
                                    <Input
                                        label="Address Line 1"
                                        {...register(`addresses.${index}.address_line1` as const, { required: "Address is required" })}
                                        placeholder="Street name..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {initialData ? 'Update Supplier' : 'Create Supplier'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
