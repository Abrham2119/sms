import { api } from "../../../lib/api";
import type { User, PaginatedResponse, ApiResponse } from "../../../types";
import { queryBuilder } from "../../../utils/queryBuilder";

export const USER_ENDPOINTS = {
    LIST: "/users",
    BASE: "/users",
    ASSIGN_ROLE: "/assign-role",
    TOGGLE_STATUS: "/users",
} as const;

export class UserService {
    static async getAll(params?: any): Promise<PaginatedResponse<User>> {
        const queryString = queryBuilder(params || {});
        const response = await api.get<ApiResponse<PaginatedResponse<User>>>(`${USER_ENDPOINTS.LIST}${queryString}`);
        return response.data.data;
    }

    static async getById(id: string): Promise<User> {
        const response = await api.get<ApiResponse<User> | User>(`${USER_ENDPOINTS.BASE}/${id}`);
        return (response.data as any).data || response.data;
    }

    static async create(data: Partial<User> & { password?: string; password_confirmation?: string; roles?: string[] }): Promise<User> {
        const response = await api.post<ApiResponse<User>>(USER_ENDPOINTS.BASE, data);
        return response.data.data;
    }

    static async update(id: string, data: Partial<User> & { password?: string; password_confirmation?: string; roles?: string[] }): Promise<User> {
        const response = await api.put<ApiResponse<User>>(`${USER_ENDPOINTS.BASE}/${id}`, data);
        return response.data.data;
    }

    static async delete(id: string): Promise<void> {
        await api.delete(`${USER_ENDPOINTS.BASE}/${id}`);
    }

    static async assignRole(userId: string, roleId: string): Promise<void> {
        await api.post(`${USER_ENDPOINTS.ASSIGN_ROLE}/${userId}`, { roles: [roleId] });
    }

    static async toggleStatus(userId: string, status: "active" | "inactive"): Promise<void> {
        await api.put(`${USER_ENDPOINTS.TOGGLE_STATUS}/${userId}/update-status`, { status });
    }

    static async updateProfilePicture(userId: string, file: File): Promise<void> {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('profile_picture', file);
        await api.post(`${USER_ENDPOINTS.BASE}/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    }

    static async getActivities(id: string, params?: any): Promise<any> {
        const queryString = queryBuilder(params || {});
        return await api.get(`${USER_ENDPOINTS.BASE}/${id}/activities${queryString}`);
    }
}
