import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import type { Column } from '../../components/table/DataTable';
import { DataTable } from '../../components/table/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PERMISSIONS } from '../../types';
import type { Evaluation } from '../../types/rfq';
import { useAwardQuotation, useRFQ, useShortlistedEvaluations } from './hooks/useRFQ';

export const ShortlistedEvaluationsPage = () => {
    const { id: rfqId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortBy, setSortBy] = useState<string | undefined>('total_score');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>('desc');

    // RFQ details for status check
    const { data: rfqData } = useRFQ(rfqId!);
    const isRFQClosedOrAwarded = ['closed', 'cancelled', 'po_generated', 'awarded'].includes(rfqData?.status?.toLowerCase() || '');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Data fetching
    const { data, isLoading, refetch } = useShortlistedEvaluations(rfqId!, {
        page,
        per_page: perPage,
        search: debouncedSearch,
        sort_by: sortBy,
        sort_order: sortOrder
    });

    const awardMutation = useAwardQuotation();

    const handleAward = async (quotationId: string) => {
        await awardMutation.mutateAsync(quotationId);
        refetch();
    };

    // const getStatusVariant = (status: string) => {
    //     switch (status?.toLowerCase()) {
    //         case 'submitted': return 'default';
    //         case 'accepted': return 'success';
    //         case 'rejected': return 'danger';
    //         case 'shortlisted': return 'warning';
    //         case 'awarded': return 'success';
    //         case 'po_generated': return 'success';
    //         default: return 'default';
    //     }
    // };

    // const formatStatus = (s: string) => {
    //     if (!s) return 'N/A';
    //     const replaced = s.replace(/_/g, ' ');
    //     return replaced.charAt(0).toUpperCase() + replaced.slice(1).toLowerCase();
    // };

    const columns: Column<Evaluation>[] = [
        {
            key: 'quotation_number',
            label: 'Quotation #',
            render: (e) => <span className="font-bold text-[#0f172a]">{e.quotation?.quotation_number || 'N/A'}</span>
        },
        {
            key: 'supplier',
            label: 'Supplier',
            render: (e) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {e.quotation?.supplier?.legal_name || 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500">{e.quotation?.supplier?.trade_name}</span>
                </div>
            )
        },
        {
            key: 'total_score',
            label: 'Total Score',
            sortable: true,
            render: (e) => (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-2 border-primary-100 flex items-center justify-center bg-primary-50">
                        <span className="text-sm font-black text-primary-700">{e.total_score || '0'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Scored</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">out of 500</span>
                    </div>
                </div>
            )
        },
        {
            key: 'total_amount',
            label: 'Amount',
            render: (e) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white">
                        {e.quotation ? parseFloat(e.quotation.total_amount).toLocaleString() : 'N/A'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {e.quotation?.currency}
                    </span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (e:any) => {
                console.log(e);
                // const status = e.quotation?.status || 'N/A';
                return (
                    <div className="whitespace-nowrap flex items-center gap-4">
                        {/* <div className="w-40">
                            <Badge variant={getStatusVariant(status) as any} className="w-full justify-center py-2.5 rounded-2xl">
                                {formatStatus(status)}
                            </Badge>
                        </div> */}
                        <Badge variant="warning" className="bg-amber-50 text-amber-700 border-amber-200 py-2.5 rounded-2xl px-4">
                            Shortlisted
                        </Badge>
                    </div>
                );
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (e) => {
                const status = e.quotation?.status?.toLowerCase() || '';
                const isAwarded = status === 'awarded' || status === 'po_generated';

                return (
                    <div className="flex justify-center gap-2" onClick={(clickEv) => clickEv.stopPropagation()}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => e.quotation && handleAward(e.quotation.id)}
                            title={isAwarded ? "Already Awarded" : "Award Contract"}
                            className="text-success-600 hover:text-success-700 hover:bg-success-50 disabled:opacity-30 disabled:grayscale disabled:pointer-events-none"
                            disabled={isAwarded || isRFQClosedOrAwarded || !e.quotation}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        {isAwarded && (
                            <span className="text-success-600 text-xs font-bold flex items-center gap-1 whitespace-nowrap ml-2">
                                <CheckCircle2 className="w-3 h-3" /> Awarded
                            </span>
                        )}
                    </div>
                );
            }
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
                            Shortlisted Quotations
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">
                            The following suppliers have been shortlisted. You can now award the contract to the best candidate.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
                    <DataTable
                        data={data?.data || []}
                        columns={columns}
                        loading={isLoading}
                        searchPlaceholder="Search shortlisted quotations..."
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
                    />
                </div>
            </div>
        </PermissionGuard>
    );
};
