import { useQueryClient } from '@tanstack/react-query';
import {
    FileText,
    Search,
    Filter,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { CustomDropdown } from '../../components/ui/CustomDropdown';
import { SubmitQuotationDialog } from './components/SubmitQuotationDialog';
import { RFQDetailsDialog } from './components/RFQDetailsDialog';
import { RFQCard } from './components/RFQCard';
import { useSupplierRFQs } from './hooks/useRFQ';

import type { RFQ } from '../../types/rfq';



export const SupplierRFQsPage = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState<string>("created_at");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const queryClient = useQueryClient();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Hooks
    const { data, isLoading } = useSupplierRFQs({
        page,
        per_page: perPage,
        search: debouncedSearch,
        sort_by: sortBy,
        sort_order: sortOrder,
        status: statusFilter === "Status: All" || statusFilter === "All" ? undefined : statusFilter.toLowerCase()
    });

    const rfqs: RFQ[] = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
    const meta = data?.current_page ? data : null;

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);

    const handleOpenDialog = (rfq: RFQ) => {
        setSelectedRfq(rfq);
        setIsDialogOpen(true);
    };

    const handleOpenDetails = (rfq: RFQ) => {
        setSelectedRfq(rfq);
        setIsDetailsOpen(true);
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="mb-10 space-y-8">
                <div className="flex flex-col items-start gap-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                            My RFQs
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">
                            Manage and respond to incoming Requests for Quotations with precision.
                        </p>
                    </div>

                    {/* Integrated Search + Filter Bar */}
                    <div className="relative z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl p-3 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row items-center gap-4">
                        <div className="relative flex-1 w-full lg:w-auto">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by RFQ reference, description, product, status..."
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-[2rem] py-4 pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto px-2">
                            <CustomDropdown
                                options={[
                                    { label: 'All', value: 'All' },
                                    { label: 'Published', value: 'Published' },
                                    { label: 'Submitted', value: 'Submitted' },
                                    { label: 'Awarded', value: 'Awarded' }
                                ]}
                                value={statusFilter}
                                onChange={setStatusFilter}
                                icon={Filter}
                                labelPrefix="Status: "
                            />

                            <CustomDropdown
                                options={[
                                    { label: 'Newest', value: 'created_at-desc' },
                                    { label: 'Deadline (Soonest)', value: 'submission_deadline-asc' },
                                    { label: 'Reference', value: 'reference_number-asc' }
                                ]}
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(val) => {
                                    const [key, order] = val.split('-');
                                    setSortBy(key);
                                    setSortOrder(order as 'asc' | 'desc');
                                }}
                                icon={ArrowUpDown}
                                labelPrefix="Sort: "
                            />
                        </div>
                    </div>
                </div>

                {/* Grid Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="h-[500px] bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : rfqs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {rfqs.map((rfq) => (
                            <RFQCard
                                key={rfq.id}
                                rfq={rfq}
                                onViewDetails={handleOpenDetails}
                                onSubmitQuotation={handleOpenDialog}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No RFQs found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Modern Pagination */}
                {meta && (
                    <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                        <div className="text-sm font-medium text-gray-500">
                            Showing <span className="text-gray-900 dark:text-white font-black">{(page - 1) * perPage + 1}–{Math.min(page * perPage, meta.total)}</span> of <span className="text-gray-900 dark:text-white font-black">{meta.total}</span> RFQs
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                className="w-12 h-12 rounded-2xl p-0 flex items-center justify-center border-gray-200 dark:border-gray-700 disabled:opacity-30"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <div className="flex items-center gap-1 bg-white dark:bg-gray-900/50 p-1 rounded-2xl border border-gray-200 dark:border-gray-800">
                                {[...Array(Math.min(5, meta.last_page))].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${page === pageNum
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                                : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                {meta.last_page > 5 && <span className="px-2 text-gray-400 font-bold">...</span>}
                                {meta.last_page > 5 && (
                                    <button
                                        onClick={() => setPage(meta.last_page)}
                                        className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${page === meta.last_page ? 'bg-primary-600 text-white' : 'text-gray-400'
                                            }`}
                                    >
                                        {meta.last_page}
                                    </button>
                                )}
                            </div>

                            <Button
                                variant="secondary"
                                className="w-12 h-12 rounded-2xl p-0 flex items-center justify-center border-gray-200 dark:border-gray-700 disabled:opacity-30"
                                onClick={() => setPage(page + 1)}
                                disabled={page === meta.last_page}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Rows per page:</span>
                            <select
                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl text-xs font-black px-3 py-2 focus:ring-primary-500/20"
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                                <option value={48}>48</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Quotation Dialog */}
                <SubmitQuotationDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    rfq={selectedRfq}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['supplier-rfqs'] });
                    }}
                />

                {/* Details Dialog */}
                <RFQDetailsDialog
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                    rfq={selectedRfq}
                />
            </div>
        </div>
    );
};
