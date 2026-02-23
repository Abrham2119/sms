
import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface DetailField {
    label: string;
    value: React.ReactNode;
}

interface DetailSection {
    title?: string;
    fields: DetailField[];
}

interface EntityDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    sections: DetailSection[];
    extraContent?: React.ReactNode;
}

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({
    isOpen,
    onClose,
    title,
    sections,
    extraContent
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            className="max-w-3xl"
        >
            <div className="space-y-8 py-4">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        {section.title && (
                            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                                {section.title}
                            </h3>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {section.fields.map((field, fieldIdx) => (
                                <div key={fieldIdx} className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {field.label}
                                    </label>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white break-words">
                                        {field.value || '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {extraContent && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                        {extraContent}
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-8">
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </div>
        </Modal>
    );
};
