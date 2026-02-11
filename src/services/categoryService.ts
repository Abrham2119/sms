import { api } from "../lib/api";
import type { Category, PaginatedResponse, ApiResponse } from "../types";
import { queryBuilder } from "../utils/queryBuilder";

export const categoryService = {
    getAll: async (params?: any) => {
        const queryString = queryBuilder(params || {});
        const response = await api.get<PaginatedResponse<Category>>(`/admin/categories${queryString}`);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<ApiResponse<Category>>(`/admin/categories/${id}`);
        return response.data;
    },

    create: async (data: Partial<Category>) => {
        const response = await api.post<ApiResponse<Category>>("/admin/categories", data);
        return response.data;
    },

    update: async (id: string, data: Partial<Category>) => {
        const response = await api.put<ApiResponse<Category>>(`/admin/categories/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/admin/categories/${id}`);
        return response.data;
    },
};
