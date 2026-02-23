import { api } from "../../../lib/api";
import type { Category, PaginatedResponse, ApiResponse } from "../../../types";
import { queryBuilder } from "../../../utils/queryBuilder";

export const CATEGORY_ENDPOINTS = {
    LIST: "/admin/categories",
    BASE: "/admin/categories",
} as const;

export class CategoryService {
    static async getAll(params?: any): Promise<PaginatedResponse<Category>> {
        const queryString = queryBuilder(params || {});
        // If the API returns { data: [...], meta: ... }, axios usually returns that in response.data
        // Adjusting based on previous implementation: response.data was returned directly.
        const response = await api.get<PaginatedResponse<Category>>(`${CATEGORY_ENDPOINTS.LIST}${queryString}`);
        return response.data;
    }

    static async getById(id: string): Promise<Category> {
        const response = await api.get<ApiResponse<Category> | Category>(`${CATEGORY_ENDPOINTS.BASE}/${id}`);
        return (response.data as any).data || response.data;
    }

    static async create(data: Partial<Category>): Promise<Category> {
        const response = await api.post<ApiResponse<Category> | Category>(CATEGORY_ENDPOINTS.BASE, data);
        return (response.data as any).data || response.data;
    }

    static async update(id: string, data: Partial<Category>): Promise<Category> {
        const response = await api.put<ApiResponse<Category> | Category>(`${CATEGORY_ENDPOINTS.BASE}/${id}`, data);
        return (response.data as any).data || response.data;
    }

    static async delete(id: string): Promise<void> {
        await api.delete(`${CATEGORY_ENDPOINTS.BASE}/${id}`);
    }
}
