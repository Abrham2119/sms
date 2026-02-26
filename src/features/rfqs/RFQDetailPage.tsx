import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
    Hash,
    Trophy,
    XCircle,
    Filter,
    Eye,
    CheckCircle2
} from 'lucide-react';
import {
    useRFQ,
    useRFQQuotations,
    useAwardQuotation,
    useRejectQuotation
} from './hooks/useRFQ';
import { ActivityLog } from '../../components/common/ActivityLog';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/table/DataTable';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { QuotationDetailsModal } from './components/QuotationDetailsModal';
import type { RFQ, Quotation } from '../../types/rfq';

// Tab Components
const ProductDetailsModal = ({ isOpen, onClose, product }: { isOpen: boolean, onClose: () => void, product: any }) => {
    if (!product) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Product Specifications"
            className="max-w-2xl"
        >
            <div className="space-y-6">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{product.name}</h4>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Category</label>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {product.category?.name || 'General'}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Requested Quantity</label>
                        <p className="text-sm font-black text-primary-600 dark:text-primary-400">
                            {product.pivot?.quantity || 0} Units
                        </p>
                    </div>
                </div>

                <div className="bg-amber-50/30 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100/50 dark:border-amber-900/20">
                    <label className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3" />
                        Requested Specifications
                    </label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic whitespace-pre-wrap leading-relaxed">
                        {product.pivot?.specifications || 'No specific technical requirements provided for this item.'}
                    </p>
                </div>

                {product.description && (
                    <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">General Description</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {product.description}
                        </p>
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <Button onClick={onClose} className="px-8">
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

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

const RFQProductsTab = ({ rfq }: { rfq: RFQ }) => {
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    return (
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
                            <th className="px-8 py-4 font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {(!rfq.products || rfq.products.length === 0) ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-12 text-center text-gray-500 italic">
                                    No items have been added to this request yet.
                                </td>
                            </tr>
                        ) : (
                            rfq.products.map((p: any) => (
                                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-gray-900 dark:text-white mb-1">
                                            {p.name || 'Item Name Undefined'}
                                        </p>
                                        {/* <p className="text-[10px] text-gray-400 font-mono tracking-tighter">ID: {p.id}</p> */}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                            {p.category?.name || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="text-base font-black text-primary-600 dark:text-primary-400">
                                            {p.pivot?.quantity || 0}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 max-w-sm text-xs italic">
                                            {p.pivot?.specifications || 'No specific requirements'}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedProduct(p)}
                                            className="text-gray-500 hover:text-primary-600 hover:bg-primary-50"
                                            title="View Specifications"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ProductDetailsModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
            />
        </div>
    );
};

const RFQQuotationsTab = ({ rfqId }: { rfqId: string }) => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [statusFilter, setStatusFilter] = useState<string>("");

    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
    const [actionQuotation, setActionQuotation] = useState<{ id: string, type: 'award' | 'reject', supplierName: string } | null>(null);

    const { data, isLoading, refetch } = useRFQQuotations(rfqId, {
        page,
        per_page: perPage,
        status: statusFilter
    });

    const awardMutation = useAwardQuotation();
    const rejectMutation = useRejectQuotation();

    const handleAction = async () => {
        if (!actionQuotation) return;

        try {
            if (actionQuotation.type === 'award') {
                await awardMutation.mutateAsync(actionQuotation.id);
            } else {
                await rejectMutation.mutateAsync(actionQuotation.id);
            }
            refetch();
            setActionQuotation(null);
        } catch (error) {
            // Error toast handled by hook
        }
    };





    const columns: Column<Quotation>[] = [
        {
            key: 'quotation_number',
            label: 'Quotation #',
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white">{item.quotation_number}</span>
                    <span className="text-[10px] text-gray-400 font-mono tracking-tighter">ID: {item.id.slice(0, 8)}</span>
                </div>
            )
        },
        {
            key: 'supplier',
            label: 'Supplier',
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {item.supplier?.legal_name || 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {item.supplier?.trade_name}
                    </span>
                </div>
            )
        },

        {
            key: 'total_amount',
            label: 'Amount',
            render: (item) => (
                <div className="font-mono font-bold text-gray-900 dark:text-white">
                    {parseFloat(item.total_amount).toFixed(2)} {item.currency}
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (item) => {
                const status = (item.status || 'pending').toLowerCase();
                const variants: Record<string, any> = {
                    awarded: 'success',
                    accepted: 'success',
                    rejected: 'danger',
                    pending: 'default',
                    submitted: 'default',
                    shortlisted: 'warning'
                };
                return (
                    <Badge variant={variants[status] || 'default'}>
                        {status.replace('_', ' ')}
                    </Badge>
                );
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item) => {
                const status = (item.status || 'pending').toLowerCase();
                const supplierName = item.supplier?.legal_name || 'Supplier';
                const isAwarded = status === 'awarded';
                const isRejected = status === 'rejected';

                return (
                    <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedQuotation(item)}
                            title="View Details"
                            className="text-gray-500 hover:text-primary-600 hover:bg-primary-50"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>



                        {!isAwarded && !isRejected && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setActionQuotation({ id: item.id, type: 'award', supplierName })}
                                    className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                    title="Award RFQ"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setActionQuotation({ id: item.id, type: 'reject', supplierName })}
                                    className="text-danger-500 hover:text-danger-600 hover:bg-danger-50"
                                    title="Reject Quotation"
                                >
                                    <XCircle className="w-4 h-4 text-danger-500" />
                                </Button>
                            </>
                        )}
                    </div>
                );
            }
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-gray-900 dark:text-white">RFQ Quotations</h3>
                </div>

                <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                        {['', 'submitted', 'awarded', 'rejected'].map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === s
                                    ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm scale-105'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                            >
                                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-8">
                <DataTable
                    data={data?.data || []}
                    columns={columns}
                    loading={isLoading}
                    serverSide
                    totalItems={data?.total || 0}
                    currentPage={page}
                    itemsPerPage={perPage}
                    onPageChange={setPage}
                    onItemsPerPageChange={setPerPage}
                    onRowClick={(item) => setSelectedQuotation(item)}
                />
            </div>

            <ConfirmDialog
                open={!!actionQuotation}
                onClose={() => setActionQuotation(null)}
                onConfirm={handleAction}
                title={actionQuotation?.type === 'award' ? 'Award RFQ to Supplier?' : 'Reject Supplier Quotation?'}
                description={actionQuotation?.type === 'award'
                    ? `Are you sure you want to award this RFQ to ${actionQuotation?.supplierName}? This will notify the supplier and finalize the selection process.`
                    : `Are you sure you want to reject the quotation from ${actionQuotation?.supplierName}? This action is irreversible.`}
                confirmText={actionQuotation?.type === 'award' ? 'Yes, Award RFQ' : 'Yes, Reject Quotation'}
                variant={actionQuotation?.type === 'award' ? 'primary' : 'danger'}
                isLoading={awardMutation.isPending || rejectMutation.isPending}
            />

            <QuotationDetailsModal
                isOpen={!!selectedQuotation}
                onClose={() => setSelectedQuotation(null)}
                quotation={selectedQuotation}
            />
        </div>
    );
};

export const RFQDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.initialTab || 'overview');

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
        { id: 'quotations', label: 'RFQ Quotations', icon: Trophy },
        { id: 'activity', label: 'Logs', icon: Activity },
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
                    <div className="flex gap-8 mt-10 border-b border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-hide">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 pb-4 text-sm font-bold transition-all relative px-1 whitespace-nowrap
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
                {activeTab === 'quotations' && <RFQQuotationsTab rfqId={id!} />}
                {activeTab === 'activity' && <ActivityLog entityType="supplier" entityId={id!} />}
            </div>
        </div>
    );
};
