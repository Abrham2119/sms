import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    FileText,
    Package,
    Activity,
    Calendar,
    MapPin,
    Truck,
    Clock,
    CheckCircle,
    AlertCircle,
    Hash
} from 'lucide-react';
import { useRFQ } from './hooks/useRFQ';
import { ActivityLog } from '../../components/common/ActivityLog';
import { Button } from '../../components/ui/Button';
import type { RFQ } from '../../types/rfq';

// Tab Components
const RFQOverviewTab = ({ rfq }: { rfq: RFQ }) => {
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* General Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    RFQ Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission Deadline</label>
                        <p className="font-medium text-gray-900 dark:text-white mt-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(rfq.submission_deadline)}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery Location</label>
                        <p className="font-medium text-gray-900 dark:text-white mt-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {rfq.delivery_location || 'Not specified'}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery Terms</label>
                        <p className="font-medium text-gray-900 dark:text-white mt-2 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-gray-400" />
                            {rfq.delivery_terms || 'Not specified'}
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-700/50">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Detailed Description</label>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {rfq.description || 'No additional description provided.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats / Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl p-6">
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-1">Status</p>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                        <span className="text-xl font-bold text-blue-900 dark:text-blue-100 capitalize">{rfq.status}</span>
                    </div>
                </div>
                <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 rounded-2xl p-6">
                    <p className="text-purple-600 dark:text-purple-400 text-sm font-semibold mb-1">Total Items</p>
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-purple-500" />
                        <span className="text-xl font-bold text-purple-900 dark:text-purple-100">{rfq.products?.length || 0} Products</span>
                    </div>
                </div>
                <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl p-6">
                    <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1">Created At</p>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-500" />
                        <span className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{formatDate(rfq.created_at)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RFQProductsTab = ({ rfq }: { rfq: RFQ }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-600" />
                Requested Items
            </h3>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700">
                {rfq.products?.length || 0} Total
            </span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="px-8 py-4 font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">Product Details</th>
                        <th className="px-8 py-4 font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">Category</th>
                        <th className="px-8 py-4 font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs text-center">Quantity</th>
                        <th className="px-8 py-4 font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">Specifications</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {(!rfq.products || rfq.products.length === 0) ? (
                        <tr>
                            <td colSpan={4} className="px-8 py-12 text-center text-gray-500 italic">
                                No items have been added to this request yet.
                            </td>
                        </tr>
                    ) : (
                        rfq.products.map((p: any) => (
                            <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                                <td className="px-8 py-5">
                                    <p className="font-bold text-gray-900 dark:text-white mb-1">
                                        {p.product?.name || p.name || 'Item Name Undefined'}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-mono tracking-tighter">ID: {p.id}</p>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                        {p.product?.category?.name || p.category?.name || 'General'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <span className="text-base font-black text-primary-600 dark:text-primary-400">
                                        {p.quantity || 0}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 max-w-sm text-xs italic">
                                        {p.specifications || 'No specific requirements'}
                                    </p>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export const RFQDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const { data: rfq, isLoading, error } = useRFQ(id!);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="text-gray-500 font-medium">Fetching RFQ details...</p>
            </div>
        );
    }

    if (error || !rfq) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Notice Not Found</h3>
                <p className="text-gray-500 max-w-sm mb-6">
                    We couldn't locate the RFQ detail. It might have been deleted or the link is invalid.
                </p>
                <Button onClick={() => navigate('/admin/rfqs')}>
                    Back to RFQ List
                </Button>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'products', label: 'Requested Items', icon: Package },
        { id: 'activity', label: 'Timeline', icon: Activity },
    ];

    return (
        <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/30 pb-20">
            {/* Header Area */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/admin/rfqs')}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white -ml-2 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                                    <Hash className="w-6 h-6 text-primary-600" />
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {rfq.reference_number}
                                </h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium ml-1">
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${rfq.status.toLowerCase() === 'published'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : rfq.status.toLowerCase() === 'draft'
                                        ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${rfq.status.toLowerCase() === 'published' ? 'bg-green-500' :
                                        rfq.status.toLowerCase() === 'draft' ? 'bg-gray-400' : 'bg-blue-500'
                                        }`}></div>
                                    {rfq.status}
                                </span>
                                <span className="hidden md:inline text-gray-300">|</span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Expires: {new Date(rfq.submission_deadline).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* <div className="flex gap-3">
                            <Button variant="outline" className="shadow-sm">
                                Download PDF
                            </Button>
                            {rfq.status === 'draft' && (
                                <Button className="shadow-lg shadow-primary-200 dark:shadow-none">
                                    Edit Request
                                </Button>
                            )}
                        </div> */}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-8 mt-10 border-b border-gray-100 dark:border-gray-700">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 pb-4 text-sm font-bold transition-all relative px-1
                                        ${isActive
                                            ? 'text-primary-600 dark:text-primary-400'
                                            : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }
                                    `}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                                    {tab.label}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full shadow-[0_-2px_4px_rgba(37,99,235,0.2)]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Display */}
            <div className="max-w-7xl mx-auto px-6 py-10 lg:px-8">
                {activeTab === 'overview' && <RFQOverviewTab rfq={rfq} />}
                {activeTab === 'products' && <RFQProductsTab rfq={rfq} />}
                {activeTab === 'activity' && <ActivityLog entityType="rfq" entityId={id!} />}
            </div>
        </div>
    );
};
