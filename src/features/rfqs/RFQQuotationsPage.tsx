import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Eye, ArrowLeft, Star, ListChecks } from 'lucide-react';
import { useRFQQuotations, useAcceptQuotation, useRejectQuotation, useEvaluateQuotation, useRFQ } from './hooks/useRFQ';
import { DataTable } from '../../components/table/DataTable';
import type { Column } from '../../components/table/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import type { Quotation } from '../../types/rfq';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { QuotationDetailsModal } from './components/QuotationDetailsModal';
import { EvaluationModal } from './components/EvaluationModal';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { PERMISSIONS } from '../../types';

export const RFQQuotationsPage = () => {
    const { id: rfqId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // Data fetching for RFQ details (fallback for status)
    const { data: rfqData } = useRFQ(rfqId!);

    const rfqStatus = (location.state?.rfqStatus || rfqData?.status || '').toLowerCase();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortBy, setSortBy] = useState<string | undefined>();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

    // UI State
    const [viewingQuotation, setViewingQuotation] = useState<Quotation | null>(null);
    const [acceptingQuotation, setAcceptingQuotation] = useState<Quotation | null>(null);
    const [rejectingQuotation, setRejectingQuotation] = useState<Quotation | null>(null);
    const [evaluatingQuotation, setEvaluatingQuotation] = useState<Quotation | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Data fetching
    const { data, isLoading, refetch } = useRFQQuotations(rfqId!, {
        page,
        per_page: perPage,
        search: debouncedSearch,
        sort_by: sortBy,
        sort_order: sortOrder
    });

    const acceptMutation = useAcceptQuotation();
    const rejectMutation = useRejectQuotation();
    const evaluateMutation = useEvaluateQuotation();

    const handleAccept = async () => {
        if (acceptingQuotation) {
            await acceptMutation.mutateAsync(acceptingQuotation.id);
            setAcceptingQuotation(null);
            refetch();
        }
    };

    const handleReject = async () => {
        if (rejectingQuotation) {
            await rejectMutation.mutateAsync(rejectingQuotation.id);
            setRejectingQuotation(null);
            refetch();
        }
    };

    const handleEvaluate = async (id: string, scores: any) => {
        await evaluateMutation.mutateAsync({ id, data: scores });
        navigate(`/admin/evaluations/${rfqId}`, { state: { rfqStatus } });
    };

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'submitted': return 'default';
            case 'accepted': return 'success';
            case 'rejected': return 'danger';
            case 'shortlisted': return 'warning';
            case 'awarded': return 'success';
            default: return 'default';
        }
    };

    const columns: Column<Quotation>[] = [
        {
            key: 'quotation_number',
            label: 'Quotation #',
            sortable: true,
            render: (q) => <span className="font-bold text-[#0f172a]">{q.quotation_number}</span>
        },
        {
            key: 'supplier',
            label: 'Supplier',
            render: (q) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">{q.supplier.legal_name}</span>
                    <span className="text-xs text-gray-500">{q.supplier.trade_name}</span>
                </div>
            )
        },
        {
            key: 'total_amount',
            label: 'Amount',
            sortable: true,
            render: (q) => (
                <div className="flex flex-col text-left">
                    <span className="font-bold text-gray-900 dark:text-white">
                        {parseFloat(q.total_amount).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{q.currency}</span>
                </div>
            )
        },
        {
            key: 'lead_time_days',
            label: 'Lead Time',
            render: (q) => <span className="text-sm font-medium text-left block">{q.lead_time_days} Days</span>
        },
        {
            key: 'status',
            label: 'Status',
            render: (q) => (
                <div className="flex flex-wrap gap-1">
                    <Badge variant={getStatusVariant(q.status) as any}>
                        {q.status.replace(/_/g, ' ')}
                    </Badge>
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (q) => (
                <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingQuotation(q)}
                        title="View Details"
                    >
                        <Eye className="w-4 h-4 text-[#0f172a]" />
                    </Button>
                    {rfqStatus === 'evaluation' && q.is_evaluated === false && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEvaluatingQuotation(q)}
                            title="Evaluate"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        >
                            <Star className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <PermissionGuard requiredPermission={PERMISSIONS.READ_RFQ}>
            <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-700">
                <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/admin/rfqs')}
                            className="mb-4 -ml-2 text-gray-500 hover:text-[#0f172a]"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to RFQs
                        </Button>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                            RFQ Quotations
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">
                            Review and manage supplier quotations for this request.
                        </p>
                    </div>
                    {rfqStatus === 'evaluation' && (
                        <Button
                            onClick={() => navigate(`/admin/evaluations/${rfqId}`, { state: { rfqStatus } })}
                            className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold py-3 px-6 rounded-2xl shadow-xl shadow-gray-200 transition-all hover:scale-105 active:scale-95"
                        >
                            <ListChecks className="w-5 h-5 mr-2" />
                            View Evaluations
                        </Button>
                    )}
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
                    <DataTable
                        data={data?.data || []}
                        columns={columns}
                        loading={isLoading}
                        searchPlaceholder="Search quotations by number or supplier..."
                        serverSide={true}
                        totalItems={data?.total || 0}
                        currentPage={page}
                        itemsPerPage={perPage}
                        onPageChange={setPage}
                        onItemsPerPageChange={(n) => {
                            setPerPage(n);
                            setPage(1);
                        }}
                        onSearchChange={setSearch}
                        onSortChange={(key, direction) => {
                            setSortBy(key);
                            setSortOrder(direction);
                        }}
                        onRowClick={(q) => setViewingQuotation(q)}
                    />
                </div>

                {/* Modals */}
                <QuotationDetailsModal
                    isOpen={!!viewingQuotation}
                    onClose={() => setViewingQuotation(null)}
                    quotation={viewingQuotation}
                />

                <ConfirmDialog
                    open={!!acceptingQuotation}
                    onClose={() => setAcceptingQuotation(null)}
                    onConfirm={handleAccept}
                    title="Accept Quotation?"
                    description={`Are you sure you want to accept quotation ${acceptingQuotation?.quotation_number} from ${acceptingQuotation?.supplier.legal_name}? This action can be further processed into an award.`}
                    confirmText="Accept Quotation"
                    variant="success"
                    isLoading={acceptMutation.isPending}
                />

                <ConfirmDialog
                    open={!!rejectingQuotation}
                    onClose={() => setRejectingQuotation(null)}
                    onConfirm={handleReject}
                    title="Reject Quotation?"
                    description={`Are you sure you want to reject quotation ${rejectingQuotation?.quotation_number} from ${rejectingQuotation?.supplier.legal_name}? This will notify the supplier.`}
                    confirmText="Reject Quotation"
                    variant="danger"
                    isLoading={rejectMutation.isPending}
                />

                <EvaluationModal
                    isOpen={!!evaluatingQuotation}
                    onClose={() => setEvaluatingQuotation(null)}
                    quotation={evaluatingQuotation}
                    onEvaluate={handleEvaluate}
                    isSubmitting={evaluateMutation.isPending}
                />
            </div>
        </PermissionGuard>
    );
};
