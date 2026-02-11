import { X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    className = ''
}) => {
    const modalRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);


    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className={`bg-white dark:bg-gray-800  rounded-xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-scale-in ${className}`}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center  justify-between px-6 py-4  border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-h-[calc(100vh-10rem)] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
