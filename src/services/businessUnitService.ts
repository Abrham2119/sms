import { api } from "../lib/api";
import type { BusinessUnit, CreateBusinessUnitRequest, BusinessUnitResponse } from "../types";
import { queryBuilder } from "../utils/queryBuilder";

export const businessUnitService = {
    getAll: async (params?: any) => {
        const queryString = queryBuilder(params || {});
        const response = await api.get<{ data: BusinessUnitResponse }>(`/admin/business-units${queryString}`);
        return response.data.data;
    },

    create: async (data: CreateBusinessUnitRequest) => {
        const response = await api.post<{ message: string; data: BusinessUnit }>("/admin/business-units", data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateBusinessUnitRequest>) => {
        // Since update can include a logo (file), we might need FormData
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value instanceof File ? value : String(value));
            }
        });

        const response = await api.post<{ message: string; data: BusinessUnit }>(
            `/admin/business-units/${id}?_method=PUT`, 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/admin/business-units/${id}`);
        return response.data;
    }
};
