import { api } from "../lib/api";
import type { BusinessUnit, BusinessUnitResponse, CreateBusinessUnitRequest } from "../types";
import { queryBuilder } from "../utils/queryBuilder";

export const businessUnitService = {
    getAll: async (params?: any) => {
        const queryString = queryBuilder(params || {});
        const response = await api.get<BusinessUnitResponse>(`/admin/business-units${queryString}`);
        return response.data;
    },

    create: async (data: CreateBusinessUnitRequest) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                const val = value as any;
                if (val instanceof File || val instanceof Blob) {
                    formData.append(key, val);
                } else {
                    formData.append(key, String(val));
                }
            }
        });
        const response = await api.post<{ message: string; data: BusinessUnit }>(
            "/admin/business-units", 
            formData,
            {
                headers: {
                    'Content-Type': undefined
                }
            }
        );
        return response.data;
    },

    update: async (id: string, data: Partial<CreateBusinessUnitRequest>) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                const val = value as any;
                if (val instanceof File || val instanceof Blob) {
                    formData.append(key, val);
                } else {
                    formData.append(key, String(val));
                }
            }
        });

        const response = await api.post<{ message: string; data: BusinessUnit }>(
            `/admin/business-units/${id}?_method=PUT`, 
            formData,
            {
                headers: {
                    'Content-Type': undefined
                }
            }
        );
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/admin/business-units/${id}`);
        return response.data;
    }
};
