import { api } from "../lib/api";
import type {
    AttachProductsRequest,
    CreateRFQRequest,
    RFQ,
    RFQResponse
} from "../types/rfq";
import { queryBuilder } from "../utils/queryBuilder";

export const rfqService = {
    create: async (data: CreateRFQRequest) => {
        const response = await api.post<RFQResponse>("/admin/rfqs", data);
        return response.data;
    },

    update: async (rfqId: string, data: CreateRFQRequest) => {
        const response = await api.put<RFQResponse>(`/admin/rfqs/${rfqId}`, data);
        return response.data;
    },

    attachProducts: async (rfqId: string, data: AttachProductsRequest) => {
        const response = await api.post<{ message: string; data: RFQ }>(
            `/admin/rfqs/${rfqId}/products`,
            data
        );
        return response.data;
    },

    publish: async (rfqId: string) => {
        const response = await api.post<{ message: string; data: RFQ }>(
            `/admin/rfqs/${rfqId}/publish`
        );
        return response.data;
    },

    getById: async (rfqId: string) => {
        const response = await api.get<RFQResponse>(`/admin/rfqs/${rfqId}`);
        return response.data.data;
    },

    getAll: async (params?: any) => {
        const queryString = queryBuilder(params || {});
        const response = await api.get<{ data: any }>("/admin/rfqs" + queryString);
        return response.data.data;
    },

    // Supplier Specific
    getSupplierRFQs: async (params?: any) => {
        const queryString = queryBuilder(params || {});
        const response = await api.get(`/supplier/rfqs${queryString}`);
        return response.data.data;
    },

    submitQuotation: async (data: any) => {
        const response = await api.post("/supplier/quotations", data);
        return response.data;
    },

    // Admin Quotation Management
    getQuotations: async (rfqId: string, params?: any) => {
        const queryString = queryBuilder(params || {});
        const response = await api.get<any>(`/admin/rfqs/${rfqId}/quotations${queryString}`);
        return response.data.data;
    },

    acceptQuotation: async (quotationId: string) => {
        const response = await api.post(`/admin/quotations/${quotationId}/accept`);
        return response.data;
    },

    rejectQuotation: async (quotationId: string) => {
        const response = await api.post(`/admin/quotations/${quotationId}/reject`);
        return response.data;
    },

    moveRFQToEvaluation: async (rfqId: string) => {
        const response = await api.post(`/admin/rfqs/${rfqId}/evaluation`);
        return response.data;
    },

    cancelRFQ: async (rfqId: string) => {
        const response = await api.post(`/admin/rfqs/${rfqId}/cancel`);
        return response.data;
    },

    closeRFQ: async (rfqId: string) => {
        const response = await api.post(`/admin/rfqs/${rfqId}/close`);
        return response.data;
    },

    evaluateQuotation: async (quotationId: string, data: any) => {
        const response = await api.post(`/admin/quotations/${quotationId}/evaluate`, data);
        return response.data;
    },

    getEvaluations: async (rfqId: string, params?: any) => {
        const queryString = queryBuilder(params || {});
        const response = await api.get(`/admin/evaluations/${rfqId}${queryString}`);
        return response.data.data;
    },

    getShortlistedEvaluations: async (rfqId: string, params?: any) => {
        const queryString = queryBuilder(params || {});
        const response = await api.get(`/admin/evaluations/${rfqId}/shortlisted${queryString}`);
        return response.data.data;
    },

    shortlistEvaluation: async (evaluationId: string) => {
        const response = await api.post(`/admin/evaluations/${evaluationId}/shortlist`);
        return response.data;
    },

    awardQuotation: async (quotationId: string) => {
        const response = await api.post(`/admin/quotations/${quotationId}/award`);
        return response.data;
    }
};
