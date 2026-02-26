import { Activity, ArrowLeft, Building2, Calendar, Clock, Download, Edit, Eye, File, FileText, Globe, Mail, MapPin, Package, Search, Settings, Trash2, UploadCloud, User, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ActivityLog } from '../../components/common/ActivityLog';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import type { Supplier } from '../../types';
import { SupplierStatusModal } from './components/SupplierStatusModal';
import { useDeleteSupplier, useSupplier, useSupplierAttachments, useUploadSupplierAttachments, useUpdateSupplierAttachment, useDeleteSupplierAttachment } from './hooks/useSupplier';
import SupplierProductsPageForTab from './SupplierProductsPageForTab';
import { Pagination } from '../../components/table/Pagination';

// Tab Components
const SupplierInfoTab = ({ supplier }: { supplier: Supplier }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        {/* Business Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-600" />
                Business Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Legal Name</label>
                    <p className="font-medium text-gray-900 dark:text-white mt-1">{supplier.legal_name}</p>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trade Name</label>
                    <p className="font-medium text-gray-900 dark:text-white mt-1">{supplier.trade_name}</p>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">TIN</label>
                    <p className="font-mono text-gray-900 dark:text-white mt-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-fit">{supplier.tin}</p>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                    <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${supplier.status === 'active' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                            supplier.status === 'suspended' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                            {supplier.status}
                        </span>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Website</label>
                    <p className="font-medium text-primary-600 mt-1 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <a href={supplier.website} target="_blank" rel="noreferrer" className="hover:underline">{supplier.website || 'N/A'}</a>
                    </p>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Primary Email</label>
                    <p className="font-medium text-gray-900 dark:text-white mt-1 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {supplier.email}
                    </p>
                </div>
            </div>
        </div>

        {/* Addresses */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Operating Locations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supplier.addresses?.length ? supplier.addresses.map((addr, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                        <span className="text-xs font-bold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded mb-2 inline-block">
                            {addr.type}
                        </span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{addr.address_line1}</p>
                        <p className="text-sm text-gray-500">{addr.city}, {addr.country}</p>
                    </div>
                )) : <p className="text-gray-500 italic">No addresses recorded.</p>}
            </div>
        </div>

        {/* Contacts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Key Personnel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supplier.contacts?.length ? supplier.contacts.map((contact, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${contact.is_primary ? 'border-blue-200 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-gray-900 dark:text-white">{contact.name}</p>
                            {contact.is_primary && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase">Primary</span>}
                        </div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{contact.role}</p>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3" /> {contact.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-3 h-3" /> {contact.phone}
                            </div>
                        </div>
                    </div>
                )) : <p className="text-gray-500 italic">No contacts recorded.</p>}
            </div>
        </div>
    </div>
);

interface AttachmentRow {
    file: File | null;
    expires_at: string;
}

const AttachmentUploadModal = ({ isOpen, onClose, supplierId }: { isOpen: boolean, onClose: () => void, supplierId: string }) => {
    const [attachments, setAttachments] = useState<AttachmentRow[]>([{ file: null, expires_at: '' }]);
    const uploadMutation = useUploadSupplierAttachments();

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

    const handleSubmit = async () => {
        const validAttachments = attachments.filter(a => a.file !== null) as { file: File, expires_at: string }[];
        if (validAttachments.length === 0) return;

        await uploadMutation.mutateAsync({
            id: supplierId,
            attachments: validAttachments.map(a => ({
                file: a.file,
                expires_at: a.expires_at || undefined
            }))
        });
        setAttachments([{ file: null, expires_at: '' }]);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Documents" className="max-w-2xl">
            <div className="space-y-6">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {attachments.map((item, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700 relative group">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Select File</label>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                                                <File className="w-4 h-4 text-primary-600" />
                                                <span className="truncate text-gray-600 dark:text-gray-300">
                                                    {item.file ? item.file.name : 'Choose a file...'}
                                                </span>
                                            </div>
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

                <div className="flex flex-col gap-4">
                    <button
                        onClick={addAttachment}
                        className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-all"
                    >
                        <UploadCloud className="w-4 h-4" />
                        + Add Another File
                    </button>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            isLoading={uploadMutation.isPending}
                            disabled={!attachments.some(a => a.file)}
                            className="flex-1"
                        >
                            Upload {attachments.filter(a => a.file).length} Documents
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const AttachmentEditModal = ({ isOpen, onClose, supplierId, attachment }: { isOpen: boolean, onClose: () => void, supplierId: string, attachment: any }) => {
    const [expiresAt, setExpiresAt] = useState('');
    const updateMutation = useUpdateSupplierAttachment();

    useEffect(() => {
        if (attachment) {
            setExpiresAt(attachment.expires_at ? attachment.expires_at.split('T')[0] : '');
        }
    }, [attachment]);

    const handleSubmit = async () => {
        await updateMutation.mutateAsync({
            supplierId,
            attachmentId: attachment.id,
            data: { expires_at: expiresAt || null }
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Attachment" className="max-w-md">
            <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <File className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{attachment?.file_name}</p>
                        <p className="text-xs text-gray-500 font-mono">ID: {attachment?.id}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Expiry Date</label>
                    <Input
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-500 italic">Clear the date if this document does not expire.</p>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        isLoading={updateMutation.isPending}
                        className="flex-1"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const AttachmentCard = ({
    attachment,
    onEdit,
    onDelete
}: {
    attachment: any;
    onEdit: (a: any) => void;
    onDelete: (a: any) => void;
}) => {
    const isExpired = attachment.expires_at && new Date(attachment.expires_at) < new Date();
    const expiration = attachment.expiration;

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
            {/* Header/Preview Area */}
            <div className="relative aspect-[4/3] bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center p-6 border-b border-gray-50 dark:border-gray-700">
                <div className="absolute top-3 right-3 flex gap-1 transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
                    <a
                        href={attachment.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-white/90 dark:bg-gray-800/90 text-gray-600 hover:text-primary-600 rounded-lg shadow-sm backdrop-blur-sm"
                        title="Preview"
                    >
                        <Eye className="w-4 h-4" />
                    </a>
                </div>

                {attachment.mime_type?.startsWith('image/') ? (
                    <img
                        src={attachment.url}
                        alt={attachment.file_name}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <FileText className={`w-10 h-10 ${isExpired ? 'text-red-400' : 'text-primary-500'}`} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{attachment.mime_type?.split('/')[1] || 'FILE'}</span>
                    </div>
                )}
            </div>

            {/* Content area */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1 space-y-3">
                    <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-gray-900 dark:text-white truncate text-sm" title={attachment.file_name}>
                            {attachment.file_name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <span>{attachment.size}</span>
                            <span>•</span>
                            <span>{new Date(attachment.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Status Badge */}
                    {expiration ? (
                        <div
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: `${expiration.color}15`, color: expiration.color }}
                        >
                            <Clock className="w-3.5 h-3.5" />
                            {expiration.human_readable}
                        </div>
                    ) : attachment.expires_at ? (
                        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium ${isExpired ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            <Calendar className="w-3.5 h-3.5" />
                            {isExpired ? 'Expired' : `Expires: ${new Date(attachment.expires_at).toLocaleDateString()}`}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-900/40 text-gray-500 italic">
                            No Expiry set
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(attachment)}
                        className="flex-1 h-8 text-xs font-bold hover:bg-primary-50 hover:text-primary-600"
                    >
                        <Edit className="w-3.5 h-3.5 mr-1.5" />
                        Edit
                    </Button>
                    <a
                        href={attachment.url}
                        download
                        className="flex-1 flex items-center justify-center h-8 px-3 py-1 bg-gray-100 dark:bg-gray-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-colors rounded-lg text-xs font-bold"
                    >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Save
                    </a>
                    <button
                        onClick={() => onDelete(attachment)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Permanently"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const AttachmentsTab = ({ supplierId }: { supplierId: string }) => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [search, setSearch] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [editingAttachment, setEditingAttachment] = useState<any>(null);
    const [deletingAttachment, setDeletingAttachment] = useState<any>(null);

    const { data: attachmentsData, isLoading } = useSupplierAttachments(supplierId, {
        page,
        per_page: perPage,
        search
    });

    const deleteMutation = useDeleteSupplierAttachment();

    const handleDelete = async () => {
        if (!deletingAttachment) return;
        await deleteMutation.mutateAsync({
            supplierId,
            attachmentId: deletingAttachment.id
        });
        setDeletingAttachment(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                        <UploadCloud className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Documents Vault</h3>
                        <p className="text-sm text-gray-500">Upload and manage certifications, contracts & legal files.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-64 group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        <Input
                            placeholder="Find document..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="pl-10 h-10 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl bg-gray-50 group-hover:bg-white transition-all"
                        />
                    </div>
                    <Button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl px-6 h-10 shadow-lg shadow-primary-200 dark:shadow-none flex items-center justify-center gap-2 group"
                    >
                        <UploadCloud className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                        Upload
                    </Button>
                </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 animate-pulse h-[320px]">
                            <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-xl mb-4" />
                            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3 mb-2" />
                            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3 mb-4" />
                            <div className="h-10 bg-gray-50 dark:bg-gray-900 rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : (attachmentsData?.data && Array.isArray(attachmentsData.data) && attachmentsData.data.length > 0) ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {attachmentsData.data.map((item: any) => (
                            <AttachmentCard
                                key={item.id}
                                attachment={item}
                                onEdit={setEditingAttachment}
                                onDelete={setDeletingAttachment}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <Pagination
                            currentPage={page}
                            totalPages={attachmentsData?.last_page || 0}
                            totalItems={attachmentsData?.total || 0}
                            itemsPerPage={perPage}
                            onPageChange={setPage}
                            onItemsPerPageChange={setPerPage}
                        />
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-full mb-4">
                        <FileText className="w-12 h-12 text-gray-300" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">No documents found</h4>
                    <p className="text-gray-500 max-w-sm mt-1">
                        {search ? `We couldn't find any documents matching "${search}".` : "This supplier hasn't uploaded any documents yet."}
                    </p>
                    <Button
                        variant="ghost"
                        onClick={() => { setSearch(''); setPage(1); }}
                        className="mt-6 text-primary-600 font-bold"
                    >
                        {search ? "Clear Search" : "Refresh List"}
                    </Button>
                </div>
            )
            }

            <AttachmentUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                supplierId={supplierId}
            />

            <AttachmentEditModal
                isOpen={!!editingAttachment}
                onClose={() => setEditingAttachment(null)}
                supplierId={supplierId}
                attachment={editingAttachment}
            />

            <ConfirmDialog
                open={!!deletingAttachment}
                onClose={() => setDeletingAttachment(null)}
                onConfirm={handleDelete}
                title="Delete Attachment"
                description={`Are you sure you want to delete "${deletingAttachment?.file_name}"? This action cannot be undone.`}
                isLoading={deleteMutation.isPending}
                confirmText="Delete"
            />
        </div>
    );
};

const SettingsTab = ({ supplier, onDelete, onStatusChange }: { supplier: Supplier, onDelete: () => void, onStatusChange: () => void }) => (
    <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Status</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">Current Status: <span className="capitalize">{supplier.status}</span></p>
                    <p className="text-sm text-gray-500">Manage the operational status of this supplier account.</p>
                </div>
                <Button onClick={onStatusChange} variant="outline">
                    Change Status
                </Button>
            </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/20">
            <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-4">Danger Zone</h3>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-red-800 dark:text-red-300">Archive Supplier</p>
                    <p className="text-sm text-red-600 dark:text-red-400/80">
                        Archive this supplier and all associated data. This action can be undone.
                    </p>
                </div>
                <Button onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">
                    Archive Supplier
                </Button>
            </div>
        </div>
    </div>
);

export const SupplierDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    const { data: supplier, isLoading } = useSupplier(id!);
    const deleteMutation = useDeleteSupplier();

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(id!);
        navigate('/suppliers');
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading supplier details...</div>;
    }

    if (!supplier) {
        return <div className="p-8 text-center text-red-500">Supplier not found.</div>;
    }

    const tabs = [
        { id: 'info', label: 'Overview', icon: FileText },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'attachments', label: 'Attachments', icon: UploadCloud },
        { id: 'Log', label: 'Activity Log', icon: Activity },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-12">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/suppliers')}
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white -ml-2 mb-2"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Suppliers
                        </Button>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-200 dark:shadow-none">
                                    {supplier.legal_name.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                        {supplier.legal_name}
                                    </h1>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Building2 className="w-3 h-3" /> {supplier.trade_name}
                                        </span>
                                        <span>•</span>
                                        <span className={`capitalize ${supplier.status === 'active' ? 'text-green-600 font-medium' : 'text-gray-500'
                                            }`}>{supplier.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setActiveTab('settings')}>
                                    <Settings className="w-4 h-4 mr-2" /> Manage
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-6 border-b border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-hide">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 pb-3 text-sm font-medium transition-all relative
                                        ${isActive
                                            ? 'text-primary-600 dark:text-primary-400'
                                            : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
                {activeTab === 'info' && <SupplierInfoTab supplier={supplier} />}
                {activeTab === 'products' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <SupplierProductsPageForTab />
                    </div>
                )}
                {activeTab === 'attachments' && <AttachmentsTab supplierId={id!} />}
                {activeTab === 'Log' && <ActivityLog entityType="supplier" entityId={id!} />}
                {activeTab === 'settings' && (
                    <SettingsTab
                        supplier={supplier}
                        onDelete={() => setIsDeleteModalOpen(true)}
                        onStatusChange={() => setIsStatusModalOpen(true)}
                    />
                )}
            </div>

            {/* Modals */}
            <ConfirmDialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Deactivate Supplier?"
                description="This will permanently remove the supplier and its associations. Are you absolutely certain?"
                confirmText="Archive management"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />

            <SupplierStatusModal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                supplier={supplier}
            />
        </div>
    );
};
