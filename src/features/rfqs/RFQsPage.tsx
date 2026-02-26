import { Eye, FileText, Pencil, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import type { Column } from '../../components/table/DataTable';
import { DataTable } from '../../components/table/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CustomDropdown } from '../../components/ui/CustomDropdown';
import { Modal } from '../../components/ui/Modal';
import { rfqService } from '../../services/rfqService';
import { PERMISSIONS } from '../../types';
import type { RFQ } from '../../types/rfq';
import { RFQMultiStepForm } from './components/RFQMultiStepForm';
import { useCancelRFQ, useCloseRFQ, useMoveRFQToEvaluation, useRFQs } from './hooks/useRFQ';

export const RFQsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRFQ, setSelectedRFQ] = useState<RFQ | undefined>(undefined);
    const navigate = useNavigate();

    // Pagination & Search State
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortBy, setSortBy] = useState<string | undefined>();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch Data
    const { data, isLoading, refetch } = useRFQs({
        page,
        per_page: perPage,
        search: debouncedSearch,
        sort_by: sortBy,
        sort_order: sortOrder
    });

    const moveEvaluationMutation = useMoveRFQToEvaluation();
    const cancelMutation = useCancelRFQ();
    const closeMutation = useCloseRFQ();

    const rfqs = data?.data || [];
    const totalItems = data?.total || 0;

    const handleCreate = () => {
        setSelectedRFQ(undefined);
        setIsModalOpen(true);
    };

    const fetchRFQDetails = async (id: string): Promise<RFQ | null> => {
        try {
            const result = await rfqService.getById(id);
            return result;
        } catch (err) {
            console.error("Failed to fetch RFQ details", err);
            toast.error("Failed to load full RFQ details");
            return null;
        }
    };

    const handleView = (rfq: RFQ) => {
        navigate(`/admin/rfqs/${rfq.id}`);
    };

    const handleViewQuotations = (rfq: RFQ) => {
        navigate(`/admin/rfqs/${rfq.id}`, { state: { initialTab: 'quotations' } });
    };

    // const handleViewEvaluations = (rfq: RFQ) => {
    //     navigate(`/admin/evaluations/${rfq.id}`);
    // };



    const handleEdit = async (rfq: RFQ) => {
        const fullData = await fetchRFQDetails(rfq.id);
        if (fullData) {
            setSelectedRFQ(fullData);
            setIsModalOpen(true);
        }
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        refetch();
    };

    const getStatusVariant = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'draft': return 'warning';
            case 'published': return 'success';
            case 'closed': return 'danger';
            default: return 'default';
        }
    };

    const columns: Column<RFQ>[] = [
        {
            key: 'reference_number',
            label: 'Reference',
            sortable: true,
            searchable: true,
            render: (rfq) => (
                <span className="text-sm font-bold text-[#0f172a]">{rfq.reference_number}</span>
            )
        },
        {
            key: 'description',
            label: 'Description',
            sortable: true,
            searchable: true,
            render: (rfq) => (
                <div className="text-sm text-gray-900 max-w-xs truncate" title={rfq.description}>
                    {rfq.description}
                </div>
            )
        },
        {
            key: 'submission_deadline',
            label: 'Deadline',
            sortable: true,
            render: (rfq) => (
                <div className="text-sm text-gray-500">{rfq.submission_deadline}</div>
            )
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (rfq) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${rfq.type === 'foreign'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : rfq.type === 'local'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                    {rfq.type}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (rfq) => {
                const currentStatus = rfq.status.toLowerCase();
                const isTerminal = ['closed', 'cancelled'].includes(currentStatus);

                const formatStatus = (s: string) => {
                    if (!s) return 'N/A';
                    const replaced = s.replace(/_/g, ' ');
                    return replaced.charAt(0).toUpperCase() + replaced.slice(1).toLowerCase();
                };

                if (isTerminal) {
                    return (
                        <div className="w-40 whitespace-nowrap">
                            <Badge variant={getStatusVariant(rfq.status) as any} className="w-full justify-center py-2.5 rounded-2xl">
                                {formatStatus(rfq.status)}
                            </Badge>
                        </div>
                    );
                }

                // Define transitions based on rules
                const isDraftOrPublished = ['draft', 'published'].includes(currentStatus);
                const isEvaluation = currentStatus === 'evaluation';

                // Initial options always include current state
                const options = [{ label: formatStatus(rfq.status), value: currentStatus }];

                if (isDraftOrPublished) {
                    options.push(
                        { label: 'Evaluation', value: 'evaluation' },
                        { label: 'Closed', value: 'closed' },
                        { label: 'Cancelled', value: 'cancelled' }
                    );
                } else if (isEvaluation) {
                    options.push(
                        { label: 'Closed', value: 'closed' },
                        { label: 'Cancelled', value: 'cancelled' }
                    );
                }

                // De-duplicate in case backend returns one of the target statuses as current
                const uniqueOptions = options.filter((opt, index, self) =>
                    index === self.findIndex((t) => t.value === opt.value)
                );

                return (
                    <div className="w-40 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <CustomDropdown
                            options={uniqueOptions}
                            value={currentStatus}
                            onChange={(newStatus: string) => {
                                if (newStatus === currentStatus) return;
                                if (newStatus === 'evaluation') moveEvaluationMutation.mutate(rfq.id);
                                else if (newStatus === 'cancelled') cancelMutation.mutate(rfq.id);
                                else if (newStatus === 'closed') closeMutation.mutate(rfq.id);
                            }}
                            labelPrefix=""
                            className="w-full"
                        />
                    </div>
                );
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (rfq) => (
                <div className="flex justify-start gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => handleView(rfq)}>
                        <Eye className="w-4 h-4 text-[#0f172a]" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewQuotations(rfq)}
                        title="View Quotations"
                    >
                        <FileText className="w-4 h-4 text-green-600" />
                    </Button>
                    {/* {['evaluation', 'closed', 'po_generated'].includes(rfq.status?.toLowerCase()) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewShortlisted(rfq)}
                            title="View Shortlisted"
                        >
                            <Trophy className="w-4 h-4 text-amber-500" />
                        </Button>
                    )} */}
                    {rfq.status?.toLowerCase() === 'draft' && (
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(rfq)}>
                            <Pencil className="w-4 h-4 text-indigo-600" />
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
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                            RFQs
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">
                            Manage and track your Requests for Quotation.
                        </p>
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="whitespace-nowrap bg-primary-500 hover:bg-primary-600 text-black font-bold py-3 px-6 rounded-2xl shadow-xl shadow-primary-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create New RFQ
                    </Button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
                    <DataTable
                        data={rfqs}
                        columns={columns}
                        loading={isLoading}
                        searchPlaceholder="Search RFQs..."
                        serverSide={true}
                        totalItems={totalItems}
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
                        onRowClick={handleView}
                    />
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={selectedRFQ ? `Edit RFQ: ${selectedRFQ.reference_number}` : 'Create New RFQ'}
                    className="max-w-4xl"
                >
                    <RFQMultiStepForm
                        key={selectedRFQ?.id || 'new'}
                        initialRFQ={selectedRFQ}
                        onSuccess={handleSuccess}
                    />
                </Modal>
            </div>
        </PermissionGuard>
    );
};

export default RFQsPage;
