import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';


interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary' | 'success';
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false
}) => {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={title}
            className="max-w-md"
        >
            <div className="flex flex-col items-center text-center py-2">
                <p className="text-gray-600 dark:text-gray-400 mb-6 px-2">
                    {description}
                </p>
                <div className="flex gap-3 w-full pt-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        className="flex-1"
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
