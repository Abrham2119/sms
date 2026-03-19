import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { businessUnitService } from '../../../services/businessUnitService';
import type { CreateBusinessUnitRequest } from '../../../types';

export const useBusinessUnits = (params?: any) => {
    return useQuery({
        queryKey: ['business-units', params],
        queryFn: () => businessUnitService.getAll(params),
    });
};

export const useCreateBusinessUnit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBusinessUnitRequest) => businessUnitService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-units'] });
            toast.success('Business Unit created successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create business unit.');
        }
    });
};

export const useUpdateBusinessUnit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<CreateBusinessUnitRequest> }) =>
            businessUnitService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-units'] });
            toast.success('Business Unit updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update business unit.');
        }
    });
};

export const useDeleteBusinessUnit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => businessUnitService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-units'] });
            toast.success('Business Unit deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete business unit.');
        }
    });
};
