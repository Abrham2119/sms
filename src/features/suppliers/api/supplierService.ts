import { api } from "../../../lib/api";
import type { ApiResponse, PaginatedResponse, Product, Supplier, SupplierProfile, SupplierProfileResponse } from "../../../types";
import { queryBuilder } from "../../../utils/queryBuilder";

export const SUPPLIER_ENDPOINTS = {
    DEL: "admin",
    LIST: "/admin/suppliers",
    BASE: "/admin/suppliers",
    MY_PRODUCTS: "supplier/my-products",
    MY_LINKED_PRODUCTS: "/supplier/my-linked-products",
    PROFILE: "/supplier/me",
    ACTIVITIES: "/admin/audit/suppliers",
} as const;

export class SupplierService {
    static async getProfile(): Promise<SupplierProfileResponse> {
        const response = await api.get<SupplierProfileResponse>(SUPPLIER_ENDPOINTS.PROFILE);
        return response.data;
    }

    static async updateProfile(data: Partial<SupplierProfile>): Promise<SupplierProfile> {
        const response = await api.put<{ data: SupplierProfile }>(SUPPLIER_ENDPOINTS.PROFILE, data);
        return response.data.data;
    }

    static async getAll(params?: any): Promise<PaginatedResponse<Supplier>> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<PaginatedResponse<Supplier>>(`${SUPPLIER_ENDPOINTS.LIST}${queryString}`);
        return response.data;
    }

    static async getById(id: string): Promise<Supplier> {
        const response = await api.get<ApiResponse<Supplier> | Supplier>(`${SUPPLIER_ENDPOINTS.BASE}/${id}`);
        // Check if response.data has a 'data' property (standard wrapper)
        return (response.data as any).data || response.data;
    }

    static async create(data: Partial<Supplier> | FormData): Promise<Supplier> {
        const response = await api.post<ApiResponse<Supplier> | Supplier>(SUPPLIER_ENDPOINTS.BASE, data, {
            headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
        });
        return (response.data as any).data || response.data;
    }

    static async update(id: string, data: Partial<Supplier> | FormData): Promise<Supplier> {
        const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        if (data instanceof FormData && !data.has('_method')) {
            data.append('_method', 'PUT');
        }

        // Use POST for FormData updates to support _method spoofing for file uploads in some backends
        const response = data instanceof FormData
            ? await api.post<ApiResponse<Supplier> | Supplier>(`${SUPPLIER_ENDPOINTS.BASE}/${id}`, data, config)
            : await api.put<ApiResponse<Supplier> | Supplier>(`${SUPPLIER_ENDPOINTS.BASE}/${id}`, data, config);

        return (response.data as any).data || response.data;
    }

    static async delete(id: string): Promise<void> {
        await api.delete(`${SUPPLIER_ENDPOINTS.BASE}/${id}`);
    }

    static async approve(id: string): Promise<void> {
        await api.post(`${SUPPLIER_ENDPOINTS.BASE}/${id}/approve`);
    }

    static async suspend(id: string): Promise<void> {
        await api.post(`${SUPPLIER_ENDPOINTS.BASE}/${id}/suspend`);
    }

    static async blacklist(id: string): Promise<void> {
        await api.post(`${SUPPLIER_ENDPOINTS.BASE}/${id}/blacklist`);
    }

    static async getAttachments(id: string, params?: any): Promise<PaginatedResponse<any>> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<any>(`${SUPPLIER_ENDPOINTS.BASE}/${id}/attachments${queryString}`);
        // Handle Laravel ApiResponse wrapper { success: true, data: { ...paginated } }
        if (response.data?.data && (response.data.data.data || response.data.data.current_page)) {
            return response.data.data;
        }
        // Handle direct PaginatedResponse
        return response.data;
    }

    static async uploadAttachments(id: string, attachments: { file: File, expires_at?: string }[]): Promise<void> {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        attachments.forEach((item, index) => {
            formData.append(`attachments[${index}][file]`, item.file);
            if (item.expires_at) {
                formData.append(`attachments[${index}][expires_at]`, item.expires_at);
            }
        });
        await api.post(`${SUPPLIER_ENDPOINTS.BASE}/${id}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    }

    static async updateAttachment(supplierId: string, attachmentId: string | number, data: { expires_at?: string | null }): Promise<void> {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        if (data.expires_at) {
            formData.append('expires_at', data.expires_at);
        } else {
            formData.append('expires_at', '');
        }
        await api.post(`${SUPPLIER_ENDPOINTS.BASE}/${supplierId}/attachments/${attachmentId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    }

    static async deleteAttachment(supplierId: string, attachmentId: string | number): Promise<void> {
        console.log(supplierId, attachmentId);
        await api.delete(`${SUPPLIER_ENDPOINTS.DEL}/attachments/${attachmentId}`);
    }

    static async getLinkedProducts(id: string, params?: any): Promise<PaginatedResponse<Product>> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<PaginatedResponse<Product>>(`${SUPPLIER_ENDPOINTS.BASE}/${id}/products${queryString}`);
        return response.data;
    }

    static async linkProducts(id: string, productIds: string[]): Promise<void> {
        await api.post(`${SUPPLIER_ENDPOINTS.BASE}/${id}/products/link`, { product_ids: productIds });
    }

    static async unlinkProduct(id: string, productIds: string[]): Promise<void> {
        await api.post(`${SUPPLIER_ENDPOINTS.BASE}/${id}/products/unlink`, { product_ids: productIds });
    }

    // New endpoints for authenticated suppliers
    static async getMyProducts(params?: any): Promise<PaginatedResponse<Product>> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<PaginatedResponse<Product>>(`${SUPPLIER_ENDPOINTS.MY_PRODUCTS}${queryString}`);
        return response.data;
    }

    static async getMyLinkedProducts(supplierId: string, params?: any): Promise<PaginatedResponse<Product>> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<PaginatedResponse<Product>>(`${SUPPLIER_ENDPOINTS.BASE}/${supplierId}/products${queryString}`);
        return response.data;
    }

    static async linkMyProducts(supplierId: string, productIds: string[]): Promise<void> {
        await api.post(`${SUPPLIER_ENDPOINTS.BASE}/${supplierId}/products/link`, { product_ids: productIds });
    }

    static async unlinkMyProduct(supplierId: string, productId: string): Promise<void> {
        await api.post(`${SUPPLIER_ENDPOINTS.BASE}/${supplierId}/products/unlink`, { product_ids: [productId] });
    }

    static async getMyProductById(id: string): Promise<Product> {
        const response = await api.get<ApiResponse<Product> | Product>(`${SUPPLIER_ENDPOINTS.MY_PRODUCTS}/${id}`);
        return (response.data as any).data || response.data;
    }

    static async getActivities(id: string, params?: any): Promise<any> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<any>(`${SUPPLIER_ENDPOINTS.ACTIVITIES}/${id}/activities${queryString}`);
        return response.data;
    }
}
