import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { rfqService } from '../../../services/rfqService';
import type { CreateRFQRequest, AttachProductsRequest } from '../../../types/rfq';

export const useRFQs = (params?: any) => {
    return useQuery({
        queryKey: ['rfqs', params],
        queryFn: () => rfqService.getAll(params),
    });
};

export const useRFQ = (id: string) => {
    return useQuery({
        queryKey: ['rfqs', id],
        queryFn: () => rfqService.getById(id),
        enabled: !!id,
    });
};

export const useCreateRFQ = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateRFQRequest) => rfqService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rfqs'] });
            toast.success('RFQ created successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create RFQ.');
        }
    });
};

export const useUpdateRFQ = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateRFQRequest }) =>
            rfqService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rfqs'] });
            toast.success('RFQ updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update RFQ.');
        }
    });
};

export const useAttachProductsRFQ = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: AttachProductsRequest }) =>
            rfqService.attachProducts(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['rfqs'] });
            queryClient.invalidateQueries({ queryKey: ['rfqs', variables.id] });
            toast.success('Products attached successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to attach products.');
        }
    });
};

export const usePublishRFQ = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => rfqService.publish(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['rfqs'] });
            queryClient.invalidateQueries({ queryKey: ['rfqs', id] });
            toast.success('RFQ published successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to publish RFQ.');
        }
    });
};

export const useSupplierRFQs = (params?: any) => {
    return useQuery({
        queryKey: ['supplier-rfqs', params],
        queryFn: () => rfqService.getSupplierRFQs(params),
    });
};

export const useSubmitQuotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => rfqService.submitQuotation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supplier-rfqs'] });
            toast.success('Quotation submitted successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to submit quotation.');
        }
    });
};

export const useRFQQuotations = (rfqId: string, params?: any) => {
    return useQuery({
        queryKey: ['rfq-quotations', rfqId, params],
        queryFn: () => rfqService.getQuotations(rfqId, params),
        enabled: !!rfqId,
    });
};

export const useAcceptQuotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => rfqService.acceptQuotation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rfq-quotations'] });
            toast.success('Quotation accepted successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to accept quotation.');
        }
    });
};

export const useRejectQuotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => rfqService.rejectQuotation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rfq-quotations'] });
            toast.success('Quotation rejected successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to reject quotation.');
        }
    });
};

export const useMoveRFQToEvaluation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => rfqService.moveRFQToEvaluation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rfqs'] });
            toast.success('RFQ moved to evaluation successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to move RFQ to evaluation.');
        }
    });
};

export const useCancelRFQ = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => rfqService.cancelRFQ(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rfqs'] });
            toast.success('RFQ cancelled successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to cancel RFQ.');
        }
    });
};

export const useCloseRFQ = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => rfqService.closeRFQ(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rfqs'] });
            toast.success('RFQ closed successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to close RFQ.');
        }
    });
};

export const useEvaluateQuotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => rfqService.evaluateQuotation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rfq-quotations'] });
            queryClient.invalidateQueries({ queryKey: ['evaluations'] });
            toast.success('Quotation evaluated successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to evaluate quotation.');
        }
    });
};

export const useEvaluations = (rfqId: string, params?: any) => {
    return useQuery({
        queryKey: ['evaluations', rfqId, params],
        queryFn: () => rfqService.getEvaluations(rfqId, params),
        enabled: !!rfqId,
    });
};

export const useShortlistedEvaluations = (rfqId: string, params?: any) => {
    return useQuery({
        queryKey: ['evaluations-shortlisted', rfqId, params],
        queryFn: () => rfqService.getShortlistedEvaluations(rfqId, params),
        enabled: !!rfqId,
    });
};

export const useShortlistEvaluation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (evaluationId: string) => rfqService.shortlistEvaluation(evaluationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['evaluations'] });
            toast.success('Supplier shortlisted successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to shortlist supplier.');
        }
    });
};

export const useAwardQuotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (quotationId: string) => rfqService.awardQuotation(quotationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['evaluations'] });
            queryClient.invalidateQueries({ queryKey: ['rfqs'] });
            toast.success('Quotation awarded successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to award quotation.');
        }
    });
};
