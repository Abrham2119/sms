import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Tag } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useAssignRole } from '../hooks/useUser';
import type { User } from '../../../types';

interface UserRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    roles?: { id: string; name: string }[];
}

export const UserRoleModal: React.FC<UserRoleModalProps> = ({
    isOpen,
    onClose,
    user,
    roles = []
}) => {
    const assignRoleMutation = useAssignRole();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<{ role: string }>();

    useEffect(() => {
        if (isOpen && user) {
            let defaultRole = '';
            if (user.roles && user.roles.length > 0) {
                const firstRole = user.roles[0];
                defaultRole = typeof firstRole === 'string' ? firstRole : firstRole.id;
            }
            reset({ role: defaultRole });
        }
    }, [isOpen, user, reset]);

    const handleFormSubmit = async (data: { role: string }) => {
        if (!user) return;

        await assignRoleMutation.mutateAsync({
            userId: user.id,
            roleId: data.role
        });
        onClose();
    };

    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Assign Role"
            className="max-w-md"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-4">
                <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-xl border border-primary-100 dark:border-primary-900/20">
                    <h4 className="flex items-center gap-2 font-semibold text-primary-900 dark:text-primary-100 mb-1">
                        <Tag className="w-4 h-4 text-primary-600" />
                        Manage Access Level
                    </h4>
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                        Select a role to assign to <strong>{user.name}</strong>.
                    </p>
                </div>

                <Select
                    label="Select Role"
                    {...register("role", { required: "Please select a role" })}
                    options={[
                        { value: '', label: 'Select a Role' },
                        ...roles.map(r => ({ value: r.id, label: r.name }))
                    ]}
                    error={errors.role?.message as string}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={assignRoleMutation.isPending}
                        className="bg-primary-600 hover:bg-primary-700 text-white"
                    >
                        Assign Role
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
