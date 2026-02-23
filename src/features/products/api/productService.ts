import { api } from "../../../lib/api";
import type { Product, PaginatedResponse, ApiResponse } from "../../../types";
import { queryBuilder } from "../../../utils/queryBuilder";

export const PRODUCT_ENDPOINTS = {
    LIST: "/admin/products",
    BASE: "/admin/products",
    ACTIVITIES: "/admin/audit/products",
} as const;

export class ProductService {
    static async getAll(params?: any): Promise<PaginatedResponse<Product>> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<PaginatedResponse<Product>>(`${PRODUCT_ENDPOINTS.LIST}${queryString}`);
        return response.data;
    }

    static async getById(id: string): Promise<Product> {
        const response = await api.get<ApiResponse<Product> | Product>(`${PRODUCT_ENDPOINTS.BASE}/${id}`);
        return (response.data as any).data || response.data;
    }

    static async create(data: Partial<Product>): Promise<Product> {
        const response = await api.post<ApiResponse<Product> | Product>(PRODUCT_ENDPOINTS.BASE, data);
        return (response.data as any).data || response.data;
    }

    static async update(id: string, data: Partial<Product>): Promise<Product> {
        const response = await api.put<ApiResponse<Product> | Product>(`${PRODUCT_ENDPOINTS.BASE}/${id}`, data);
        return (response.data as any).data || response.data;
    }

    static async delete(id: string): Promise<void> {
        await api.delete(`${PRODUCT_ENDPOINTS.BASE}/${id}`);
    }

    static async getSuppliers(id: string, params?: any): Promise<PaginatedResponse<any>> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<PaginatedResponse<any>>(`${PRODUCT_ENDPOINTS.BASE}/${id}/suppliers${queryString}`);
        return response.data;
    }

    static async getActivities(id: string, params?: any): Promise<any> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<any>(`${PRODUCT_ENDPOINTS.ACTIVITIES}/${id}/activities${queryString}`);
        return response.data;
    }
}
