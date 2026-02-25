import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock } from 'lucide-react';
import type { User as UserType } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface UserFormDialogProps {
    open: boolean;
    onClose: () => void;
    initialData?: UserType | null;
    onSubmit: (data: any) => Promise<void>;
    roles?: { id: string; name: string }[];
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
    open,
    onClose,
    initialData,
    onSubmit,
    roles = []
}) => {
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<any>({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            roles: [],
            password: '',
            password_confirmation: ''
        }
    });

    const password = watch("password");

    useEffect(() => {
        if (open) {
            if (initialData) {
                let defaultRoles: string[] = [];
                if (initialData.roles && initialData.roles.length > 0) {
                    defaultRoles = initialData.roles.map((role: any) =>
                        typeof role === 'string' ? role : role.id
                    );
                }
                reset({
                    name: initialData.name,
                    email: initialData.email,
                    phone: initialData.phone || '',
                    roles: defaultRoles,
                    password: '',
                    password_confirmation: ''
                });
            } else {
                reset({
                    name: '',
                    email: '',
                    phone: '',
                    roles: [],
                    password: '',
                    password_confirmation: ''
                });
            }
        }
    }, [open, initialData, reset]);

    const handleFormSubmit = async (data: any) => {
        // Prepare payload
        const payload: any = {
            name: data.name,
            email: data.email,
            phone: data.phone,
        };

        if (data.roles && data.roles.length > 0) {
            payload.roles = data.roles;
        }

        // Include password only if it's provided (important for Edit mode)
        if (data.password) {
            payload.password = data.password;
            payload.password_confirmation = data.password_confirmation;
        }

        await onSubmit(payload);
        onClose();
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={initialData ? 'Edit User' : 'Register New User'}
            className="max-w-2xl"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Information</h3>
                        <p className="text-xs text-gray-500">Basic details and credentials</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Full Name"
                        icon={<User className="w-4 h-4" />}
                        {...register("name", { required: "Name is required" })}
                        placeholder="John Doe"
                        error={errors.name?.message as string}
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        icon={<Mail className="w-4 h-4" />}
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                        })}
                        placeholder="john@example.com"
                        error={errors.email?.message as string}
                    />
                    <Input
                        label="Phone Number"
                        icon={<Phone className="w-4 h-4" />}
                        {...register("phone")}
                        placeholder="+251..."
                    />
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Assign Roles</label>
                        <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            {roles.map((role) => (
                                <label key={role.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        value={role.id}
                                        {...register("roles")}
                                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-600 transition-colors">
                                        {role.name.replace(/_/g, ' ')}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {errors.roles && (
                            <p className="mt-1 text-sm text-danger-500">{errors.roles.message as string}</p>
                        )}
                    </div>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
                        {initialData ? 'Change Password (Optional)' : 'Security'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Password"
                            type="password"
                            icon={<Lock className="w-4 h-4" />}
                            {...register("password", {
                                required: !initialData ? "Password is required" : false,
                                minLength: { value: 6, message: "Minimum 6 characters" }
                            })}
                            placeholder="••••••••"
                            error={errors.password?.message as string}
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            icon={<Lock className="w-4 h-4" />}
                            {...register("password_confirmation", {
                                validate: value => !password || value === password || "Passwords do not match"
                            })}
                            placeholder="••••••••"
                            error={errors.password_confirmation?.message as string}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-xl px-8"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="rounded-xl px-8 bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-lg shadow-primary-200"
                    >
                        {initialData ? 'Update User' : 'Create User'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
