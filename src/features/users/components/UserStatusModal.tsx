import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import type { User } from '../../../types';
import { useToggleUserStatus } from '../hooks/useUser';

interface UserStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export const UserStatusModal: React.FC<UserStatusModalProps> = ({
    isOpen,
    onClose,
    user
}) => {
    const toggleStatusMutation = useToggleUserStatus();

    if (!user) return null;

    const isActive = user.status === 'active';
    const newStatus = isActive ? 'inactive' : 'active';
    const actionText = isActive ? 'Deactivate' : 'Activate';

    const handleConfirm = async () => {
        await toggleStatusMutation.mutateAsync({
            userId: user.id,
            status: newStatus
        });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={``}
            className="max-w-md"
        >
            <div className="pb-6 flex flex-col items-center text-center space-y-4">

                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {actionText} {user.name}?
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    {isActive
                        ? `This will prevent ${user.name} from accessing the system. You can reactivate them later.`
                        : `This will restore system access for ${user.name} with their previously assigned permissions.`
                    }
                </p>

                <div className="flex w-full gap-3 pt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={toggleStatusMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        isLoading={toggleStatusMutation.isPending}
                        className={`flex-1 text-black font-bold shadow-lg ${isActive
                            ? 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/20'
                            : 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/20'
                            }`}
                    >
                        Confirm {actionText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
