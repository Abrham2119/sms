
import React, { useState, useRef } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Upload, X, CheckCircle, AlertTriangle, Ban, FileText } from 'lucide-react';
import {
    useApproveSupplier,
    useSuspendSupplier,
    useBlacklistSupplier,
    useUploadSupplierAttachments
} from '../hooks/useSupplier';
import type { Supplier } from '../../../types';

interface SupplierStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplier: Supplier | null;
}

export const SupplierStatusModal: React.FC<SupplierStatusModalProps> = ({
    isOpen,
    onClose,
    supplier
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const approveMutation = useApproveSupplier();
    const suspendMutation = useSuspendSupplier();
    const blacklistMutation = useBlacklistSupplier();
    const uploadMutation = useUploadSupplierAttachments();

    if (!supplier) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...filesArray]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length > 0) {
            await uploadMutation.mutateAsync({ id: supplier.id, files: selectedFiles });
            setSelectedFiles([]);
        }
    };

    const handleStatusChange = async (action: 'approve' | 'suspend' | 'blacklist') => {
        switch (action) {
            case 'approve':
                await approveMutation.mutateAsync(supplier.id);
                break;
            case 'suspend':
                await suspendMutation.mutateAsync(supplier.id);
                break;
            case 'blacklist':
                await blacklistMutation.mutateAsync(supplier.id);
                break;
        }
        onClose();
    };

    const isPending = approveMutation.isPending || suspendMutation.isPending || blacklistMutation.isPending || uploadMutation.isPending;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Manage Supplier: ${supplier.legal_name}`}
            className="max-w-2xl"
        >
            <div className="space-y-8 py-4">
                {/* Status Actions */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Change Status</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Button
                            variant="secondary"
                            className="flex items-center justify-center gap-2 border-green-200 hover:bg-green-50 text-green-700"
                            onClick={() => handleStatusChange('approve')}
                            disabled={isPending || supplier.status === 'active'}
                        >
                            <CheckCircle className="w-4 h-4" /> Approve
                        </Button>
                        <Button
                            variant="secondary"
                            className="flex items-center justify-center gap-2 border-warning-200 hover:bg-warning-50 text-warning-700"
                            onClick={() => handleStatusChange('suspend')}
                            disabled={isPending || supplier.status === 'suspended'}
                        >
                            <AlertTriangle className="w-4 h-4" /> Suspend
                        </Button>
                        <Button
                            variant="secondary"
                            className="flex items-center justify-center gap-2 border-danger-200 hover:bg-danger-50 text-danger-700"
                            onClick={() => handleStatusChange('blacklist')}
                            disabled={isPending || supplier.status === 'blacklisted'}
                        >
                            <Ban className="w-4 h-4" /> Blacklist
                        </Button>
                    </div>
                </div>

                {/* Attachments Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Attachments</h3>

                    <div
                        className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            multiple
                            className="hidden"
                        />
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Click to upload or drag and drop files
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PDF, DOC, JPG, PNG (Max 10MB per file)</p>
                    </div>

                    {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Selected Files ({selectedFiles.length})
                                </span>
                                <Button
                                    size="sm"
                                    onClick={handleUpload}
                                    disabled={isPending}
                                >
                                    Upload All
                                </Button>
                            </div>
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                                {selectedFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-primary-500" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                                                    {file.name}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end mt-8">
                <Button variant="secondary" onClick={onClose} disabled={isPending}>
                    Close
                </Button>
            </div>
        </Modal>
    );
};
