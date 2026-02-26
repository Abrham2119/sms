
import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { X, CheckCircle, AlertTriangle, Ban, FileText, UploadCloud } from 'lucide-react';
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
    const [attachments, setAttachments] = useState<{ file: File | null; expires_at: string }[]>([{ file: null, expires_at: '' }]);

    const approveMutation = useApproveSupplier();
    const suspendMutation = useSuspendSupplier();
    const blacklistMutation = useBlacklistSupplier();
    const uploadMutation = useUploadSupplierAttachments();

    if (!supplier) return null;

    const handleFileChange = (index: number, file: File | null) => {
        setAttachments(prev => prev.map((item, i) => i === index ? { ...item, file } : item));
    };

    const handleDateChange = (index: number, expires_at: string) => {
        setAttachments(prev => prev.map((item, i) => i === index ? { ...item, expires_at } : item));
    };

    const addAttachment = () => {
        setAttachments(prev => [...prev, { file: null, expires_at: '' }]);
    };

    const removeAttachment = (index: number) => {
        if (attachments.length === 1) {
            setAttachments([{ file: null, expires_at: '' }]);
            return;
        }
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        const validAttachments = attachments.filter(a => a.file !== null) as { file: File, expires_at: string }[];
        if (validAttachments.length > 0) {
            await uploadMutation.mutateAsync({
                id: supplier.id,
                attachments: validAttachments.map(a => ({
                    file: a.file,
                    expires_at: a.expires_at || undefined
                }))
            });
            setAttachments([{ file: null, expires_at: '' }]);
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
            className="max-w-3xl"
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
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Attachments</h3>
                    </div>

                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {attachments.map((item, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700 relative group">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Select File</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                                                <FileText className="w-4 h-4 text-primary-600" />
                                                <span className="truncate text-gray-600 dark:text-gray-300">
                                                    {item.file ? item.file.name : 'Choose a file...'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Expiry Date (Optional)</label>
                                        <Input
                                            type="date"
                                            value={item.expires_at}
                                            onChange={(e) => handleDateChange(index, e.target.value)}
                                            className="h-9"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeAttachment(index)}
                                    className="absolute -top-2 -right-2 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                        <button
                            onClick={addAttachment}
                            className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-all"
                        >
                            <UploadCloud className="w-4 h-4" />
                            + Add Another File
                        </button>

                        <Button
                            onClick={handleUpload}
                            isLoading={uploadMutation.isPending}
                            disabled={!attachments.some(a => a.file)}
                            className="w-full"
                        >
                            Upload {attachments.filter(a => a.file).length} Documents
                        </Button>
                    </div>
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
