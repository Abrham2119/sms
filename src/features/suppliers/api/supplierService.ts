import { api } from "../../../lib/api";
import type { Supplier, PaginatedResponse, ApiResponse, Product } from "../../../types";
import { queryBuilder } from "../../../utils/queryBuilder";

export const SUPPLIER_ENDPOINTS = {
    LIST: "/admin/suppliers",
    BASE: "/admin/suppliers",
} as const;

export class SupplierService {
    static async getAll(params?: any): Promise<PaginatedResponse<Supplier>> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<PaginatedResponse<Supplier>>(`${SUPPLIER_ENDPOINTS.LIST}${queryString}`);
        return response.data;
    }

    static async getById(id: string): Promise<Supplier> {
        const response = await api.get<ApiResponse<Supplier>>(`${SUPPLIER_ENDPOINTS.BASE}/${id}`);
        return response.data.data;
    }

    static async create(data: Partial<Supplier>): Promise<Supplier> {
        const response = await api.post<ApiResponse<Supplier>>(SUPPLIER_ENDPOINTS.BASE, data);
        return response.data.data;
    }

    static async update(id: string, data: Partial<Supplier>): Promise<Supplier> {
        const response = await api.put<ApiResponse<Supplier>>(`${SUPPLIER_ENDPOINTS.BASE}/${id}`, data);
        return response.data.data;
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

    static async uploadAttachments(id: string, files: File[]): Promise<void> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("attachment[]", file);
        });
        await api.put(`${SUPPLIER_ENDPOINTS.BASE}/${id}/attachments`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    static async getLinkedProducts(id: string, params?: any): Promise<PaginatedResponse<Product>> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<PaginatedResponse<Product>>(`${SUPPLIER_ENDPOINTS.BASE}/${id}/products${queryString}`);
        return response.data;
    }

    static async linkProducts(id: string, productIds: string[]): Promise<void> {
        await api.post(`${SUPPLIER_ENDPOINTS.BASE}/${id}/products/link`, { product_ids: productIds });
    }

    static async unlinkProduct(id: string, productId: string): Promise<void> {
        await api.post(`${SUPPLIER_ENDPOINTS.BASE}/${id}/products/unlink`, { product_ids: [productId] });
    }
}
