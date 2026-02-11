import { api } from "../lib/api";
import type { Product, PaginatedResponse, ApiResponse } from "../types";
import { queryBuilder } from "../utils/queryBuilder";

export const productService = {
    getAll: async (params?: any) => {
        const queryString = queryBuilder(params || {});
        const response = await api.get<PaginatedResponse<Product>>(`/admin/products${queryString}`);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<ApiResponse<Product>>(`/admin/products/${id}`);
        return response.data;
    },

    create: async (data: Partial<Product>) => {
        const response = await api.post<ApiResponse<Product>>("/admin/products", data);
        return response.data;
    },

    update: async (id: string, data: Partial<Product>) => {
        const response = await api.put<ApiResponse<Product>>(`/admin/products/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/admin/products/${id}`);
        return response.data;
    },
};
