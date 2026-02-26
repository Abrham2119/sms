import { api } from "../../../lib/api";
import type { UOM, PaginatedResponse, ApiResponse } from "../../../types";
import { queryBuilder } from "../../../utils/queryBuilder";

export const UOM_ENDPOINTS = {
    LIST: "/admin/uoms",
    BASE: "/admin/uoms",
} as const;

export class UomService {
    static async getAll(params?: any): Promise<PaginatedResponse<UOM>> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<ApiResponse<PaginatedResponse<UOM>>>(`${UOM_ENDPOINTS.LIST}${queryString}`);
        return response.data.data;
    }

    static async getById(id: string): Promise<UOM> {
        const response = await api.get<ApiResponse<UOM> | UOM>(`${UOM_ENDPOINTS.BASE}/${id}`);
        return (response.data as any).data || response.data;
    }

    static async create(data: Partial<UOM>): Promise<UOM> {
        const response = await api.post<ApiResponse<UOM> | UOM>(UOM_ENDPOINTS.BASE, data);
        return (response.data as any).data || response.data;
    }

    static async update(id: string, data: Partial<UOM>): Promise<UOM> {
        const response = await api.put<ApiResponse<UOM> | UOM>(`${UOM_ENDPOINTS.BASE}/${id}`, data);
        return (response.data as any).data || response.data;
    }

    static async delete(id: string): Promise<void> {
        await api.delete(`${UOM_ENDPOINTS.BASE}/${id}`);
    }
}
