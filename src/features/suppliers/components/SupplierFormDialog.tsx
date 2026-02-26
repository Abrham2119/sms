import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Globe, Mail, Phone, User, MapPin, Building2, CreditCard } from 'lucide-react';
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
            type: 'local',
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
                    type: 'local',
                    status: 'active',
                    contacts: [{ name: '', email: '', phone: '', role: '', is_primary: true }],
                    addresses: [{ type: 'hq', country: 'Ethiopia', city: '', address_line1: '' }]
                });
            }
        }
    }, [open, initialData, reset]);

    const handleFormSubmit = async (data: any) => {
        // Construct business data payload exactly as requested
        const payload = {
            type: data.type,
            legal_name: data.legal_name,
            trade_name: data.trade_name,
            email: data.email,
            tin: data.tin,
            website: data.website,
            status: data.status,
            contacts: data.contacts.map((c: any) => ({
                ...c,
                is_primary: !!c.is_primary // Ensure boolean as requested
            })),
            addresses: data.addresses
        };

        // If a logo is present, we include it in the object passed to onSubmit
        // The service will handle splitting JSON from FormData
        await onSubmit({
            ...payload,
            logo: (data.logo && data.logo[0]) ? data.logo[0] : undefined
        });
        onClose();
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={initialData ? 'Edit Supplier Profile' : 'Register New Supplier'}
            className="max-w-5xl"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 py-4">
                {/* Section: Basic Information */}
                <div>
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-3">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                            <Building2 className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Business Information</h3>
                            <p className="text-xs text-gray-500">Legal and public identifiers for the company</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Legal Company Name"
                            {...register("legal_name", { required: "Legal name is required" })}
                            placeholder="e.g. Acme Corporation Ltd."
                            error={errors.legal_name?.message}
                        />
                        <Input
                            label="Trade Name (DBA)"
                            {...register("trade_name", { required: "Trade name is required" })}
                            placeholder="e.g. Acme"
                            error={errors.trade_name?.message}
                        />
                        <Input
                            label="Official Email Address"
                            type="email"
                            icon={<Mail className="w-4 h-4" />}
                            {...register("email", { required: "Email is required" })}
                            placeholder="office@acme.com"
                            error={errors.email?.message}
                        />
                        <Input
                            label="Tax Identification Number (TIN)"
                            icon={<CreditCard className="w-4 h-4" />}
                            {...register("tin", { required: "TIN is required" })}
                            placeholder="123456789"
                            error={errors.tin?.message}
                        />
                        <Input
                            label="Company Website"
                            icon={<Globe className="w-4 h-4" />}
                            {...register("website")}
                            placeholder="https://acme.com"
                        />
                        <Select
                            label="Current Status"
                            {...register("status")}
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                                { value: 'suspended', label: 'Suspended' },
                                { value: 'blacklisted', label: 'Blacklisted' }
                            ]}
                        />
                        <Select
                            label="Supplier Type"
                            {...register("type", { required: "Supplier type is required" })}
                            options={[
                                { value: 'local', label: 'Local' },
                                { value: 'foreign', label: 'Foreign' }
                            ]}
                            error={errors.type?.message}
                        />
                        <Input
                            label="Company Logo"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            {...register("logo")}
                        />
                    </div>
                </div>

                {/* Section: Contact Persons */}
                <div>
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Primary Contacts</h3>
                                <p className="text-xs text-gray-500">Individuals responsible for communication</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendContact({ name: '', email: '', phone: '', role: '', is_primary: false })}
                            className="rounded-xl font-bold"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Contact
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {contactFields.map((field, index) => (
                            <div key={field.id} className="p-6 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700 relative group animate-in slide-in-from-right-4">
                                {contactFields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeContact(index)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-danger-500 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-danger-50 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Input
                                        label="Full Name"
                                        {...register(`contacts.${index}.name` as const, { required: "Name is required" })}
                                        placeholder="John Doe"
                                    />
                                    <Input
                                        label="Direct Email"
                                        type="email"
                                        icon={<Mail className="w-3 h-3" />}
                                        {...register(`contacts.${index}.email` as const)}
                                        placeholder="john@acme.com"
                                    />
                                    <Input
                                        label="Phone Number"
                                        icon={<Phone className="w-3 h-3" />}
                                        {...register(`contacts.${index}.phone` as const)}
                                        placeholder="+251..."
                                    />
                                    <Input
                                        label="Designation/Role"
                                        {...register(`contacts.${index}.role` as const)}
                                        placeholder="e.g. Sales Manager"
                                    />
                                </div>
                                <div className="mt-4 flex items-center">
                                    <label className="flex items-center cursor-pointer group/cb">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                {...register(`contacts.${index}.is_primary` as const)}
                                                className="peer hidden"
                                            />
                                            <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <span className="ml-3 text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover/cb:text-primary-600 transition-colors">
                                            Set as Primary Contact
                                        </span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: Physical Addresses */}
                <div>
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <MapPin className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Locations</h3>
                                <p className="text-xs text-gray-500">Points of business and distribution</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendAddress({ type: 'hq', country: 'Ethiopia', city: '', address_line1: '' })}
                            className="rounded-xl font-bold"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Location
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {addressFields.map((field, index) => (
                            <div key={field.id} className="p-6 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700 relative group animate-in slide-in-from-right-4">
                                {addressFields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeAddress(index)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-danger-500 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-danger-50 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Select
                                        label="Location Type"
                                        {...register(`addresses.${index}.type` as const)}
                                        options={[
                                            { value: 'hq', label: 'Headquarters' },
                                            { value: 'warehouse', label: 'Warehouse' },
                                            { value: 'office', label: 'Regional Office' },
                                            { value: 'store', label: 'Retail Store' }
                                        ]}
                                    />
                                    <Input
                                        label="Country"
                                        {...register(`addresses.${index}.country` as const)}
                                        placeholder="Ethiopia"
                                    />
                                    <Input
                                        label="City/District"
                                        {...register(`addresses.${index}.city` as const, { required: "City is required" })}
                                        placeholder="Addis Ababa"
                                    />
                                    <Input
                                        label="Specific Address"
                                        {...register(`addresses.${index}.address_line1` as const, { required: "Address is required" })}
                                        placeholder="Sub-city, Woreda, Suite..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-xl px-8"
                    >
                        Discard Changes
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="rounded-xl px-8 bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-lg shadow-primary-200"
                    >
                        {initialData ? 'Update Supplier Profile' : 'Complete Registration'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
