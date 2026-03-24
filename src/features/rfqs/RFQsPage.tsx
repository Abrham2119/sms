import { Eye, FileText, Pencil, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import type { Column } from '../../components/table/DataTable';
import { DataTable } from '../../components/table/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { rfqService } from '../../services/rfqService';
import { PERMISSIONS } from '../../types';
import type { RFQ } from '../../types/rfq';
import { RFQMultiStepForm } from './components/RFQMultiStepForm';
import { useFinalizeCloseRFQ, useRFQs } from './hooks/useRFQ';

export const RFQsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [selectedRFQ, setSelectedRFQ] = useState<RFQ | undefined>(undefined);
    const [rfqToClose, setRfqToClose] = useState<RFQ | undefined>(undefined);
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

    const finalizeCloseMutation = useFinalizeCloseRFQ();

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

    const handleCloseClick = (rfq: RFQ) => {
        setRfqToClose(rfq);
        setIsCloseModalOpen(true);
    };

    const handleConfirmClose = () => {
        if (rfqToClose) {
            finalizeCloseMutation.mutate(rfqToClose.id, {
                onSuccess: () => {
                    setIsCloseModalOpen(false);
                    setRfqToClose(undefined);
                }
            });
        }
    };

    const columns: Column<RFQ>[] = [
        {
            key: 'row_number',
            label: '#',
            render: (rfq) => {
                const index = rfqs.findIndex((r: RFQ) => r.id === rfq.id);
                return (
                    <span className="text-xs font-bold text-gray-400">
                        {index !== -1 ? (page - 1) * perPage + index + 1 : '-'}
                    </span>
                );
            }
        },
        {
            key: 'reference_number',
            label: 'Reference',
            sortable: true,
            searchable: true,
            render: (rfq) => (
                <div className=' flex flex-row gap-3 items-center justify-center'>
                    <span className="text-sm font-bold text-[#0f172a]">{rfq.reference_number}</span>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full text-[#0f172a] bg-primary-50  text-[10px] font-black border border-primary-100 shrink-0">
                        {rfq.number_of_suppliers || 0}
                    </div>
                </div>
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
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${rfq.for === 'foreign'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    : rfq.for === 'local'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                    {rfq.for}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (rfq) => {
                const formatStatus = (s: string) => {
                    if (!s) return 'N/A';
                    const replaced = s.replace(/_/g, ' ');
                    return replaced.charAt(0).toUpperCase() + replaced.slice(1).toLowerCase();
                };

                return (
                    <div className="w-40 whitespace-nowrap">
                        <Badge variant={getStatusVariant(rfq.status) as any} className="w-full justify-center py-2.5 rounded-2xl">
                            {formatStatus(rfq.status)}
                        </Badge>
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
        },
        {
            key: 'close',
            label: 'Close',
            render: (rfq) => (
                <div className="flex justify-start gap-2" onClick={(e) => e.stopPropagation()}>
                    {!['closed', 'cancelled'].includes(rfq.status?.toLowerCase()) && (
                        <Button variant="ghost" size="sm" onClick={() => handleCloseClick(rfq)}>
                            <X className="w-4 h-4 text-red-500" />
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

                <Modal
                    isOpen={isCloseModalOpen}
                    onClose={() => setIsCloseModalOpen(false)}
                    title="Confirm Close RFQ"
                    className="max-w-2xl"
                >
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6 w-full justify-center text-red-600">

                            <h3 className="text-xl font-bold">Are you absolutely sure?</h3>
                        </div>
                        <p className="text-gray-600 mb-8">
                            You are about to close RFQ <span className="font-bold text-gray-900">{rfqToClose?.reference_number}</span>.
                            This will prevent any further quotations and move the process to a final state. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => setIsCloseModalOpen(false)}
                                className="px-6"
                            >
                                No, Keep Open
                            </Button>
                            <Button
                                onClick={handleConfirmClose}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 shadow-lg shadow-red-200"
                                isLoading={finalizeCloseMutation.isPending}
                            >
                                Yes, Close RFQ
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </PermissionGuard>
    );
};

export default RFQsPage;
