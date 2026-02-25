import { Activity, ArrowLeft, Building2, FileText, Globe, Mail, MapPin, Package, Settings, UploadCloud, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ActivityLog } from '../../components/common/ActivityLog';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { Supplier } from '../../types';
import { SupplierStatusModal } from './components/SupplierStatusModal';
import { useDeleteSupplier, useSupplier } from './hooks/useSupplier';
import SupplierProductsPageForTab from './SupplierProductsPageForTab';

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

const AttachmentsTab = () => (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        {/* <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 text-gray-400" />
        </div> */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Documents Attached</h3>
        {/* <p className="text-gray-500 text-center max-w-md mb-6">
            Upload contracts, certifications, and other compliance documents here.
        </p> */}
        {/* <Button variant="outline">
            Upload Document
        </Button> */}
    </div>
);

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
                {activeTab === 'attachments' && <AttachmentsTab />}
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
