import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Globe, CreditCard, Phone, Camera } from 'lucide-react';
import type { BusinessUnit } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

interface BusinessUnitFormDialogProps {
    open: boolean;
    onClose: () => void;
    initialData?: BusinessUnit | null;
    onSubmit: (data: any) => Promise<void>;
}

export const BusinessUnitFormDialog: React.FC<BusinessUnitFormDialogProps> = ({
    open,
    onClose,
    initialData,
    onSubmit
}) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<any>({
        defaultValues: {
            type: 'local',
            legal_name: '',
            trade_name: '',
            email: '',
            phone: '',
            tin: '',
            website: ''
        }
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { logo, ...rest } = initialData;
                reset({
                    ...rest,
                    phone: initialData.phone || '',
                    website: initialData.website || ''
                });
            } else {
                reset({
                    type: 'local',
                    legal_name: '',
                    trade_name: '',
                    email: '',
                    phone: '',
                    tin: '',
                    website: ''
                });
            }
        }
    }, [open, initialData, reset]);

    const handleFormSubmit = async (data: any) => {
        // Only take the file if it's a FileList with at least one item
        const logoFile = (data.logo && data.logo instanceof FileList && data.logo.length > 0) 
            ? data.logo[0] 
            : undefined;
        
        const payload: any = {
            type: data.type,
            legal_name: data.legal_name,
            trade_name: data.trade_name,
            email: data.email,
            tin: data.tin,
            website: data.website,
            phone: data.phone
        };

        if (logoFile) {
            payload.logo = logoFile;
        }

        await onSubmit(payload);
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={initialData ? 'Edit Business Unit' : 'Create Business Unit'}
            className="max-w-2xl"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Type"
                        {...register("type", { required: "Type is required" })}
                        options={[
                            { value: 'local', label: 'Local' },
                            { value: 'foreign', label: 'Foreign' }
                        ]}
                        error={errors.type?.message as string}
                    />
                    <Input
                        label="Legal Name"
                        {...register("legal_name", { required: "Legal name is required" })}
                        placeholder="Acme Corporation"
                        error={errors.legal_name?.message as string}
                    />
                    <Input
                        label="Trade Name"
                        {...register("trade_name", { required: "Trade name is required" })}
                        placeholder="Acme"
                        error={errors.trade_name?.message as string}
                    />
                    <Input
                        label="Email"
                        type="email"
                        icon={<Mail className="w-4 h-4" />}
                        {...register("email", { required: "Email is required" })}
                        placeholder="admin@acme.com"
                        error={errors.email?.message as string}
                    />
                    <Input
                        label="TIN"
                        icon={<CreditCard className="w-4 h-4" />}
                        {...register("tin", { required: "TIN is required" })}
                        placeholder="123456789"
                        error={errors.tin?.message as string}
                    />
                    <Input
                        label="Phone"
                        icon={<Phone className="w-4 h-4" />}
                        {...register("phone")}
                        placeholder="+251..."
                    />
                    <Input
                        label="Website"
                        icon={<Globe className="w-4 h-4" />}
                        {...register("website")}
                        placeholder="https://acme.com"
                    />
                    <div className="md:col-span-2">
                         <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Company Logo
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden group hover:border-primary-500 transition-colors">
                                <Camera className="w-6 h-6 text-gray-400 group-hover:text-primary-500" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("logo")}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <div className="text-xs text-gray-500">
                                <p className="font-bold text-gray-700 dark:text-gray-300">Upload logo</p>
                                <p>PNG, JPG up to 2MB</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 shadow-lg shadow-primary-200"
                    >
                        {initialData ? 'Update Business Unit' : 'Create Business Unit'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
