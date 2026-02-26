import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { UomService } from '../api/uomService';
import type { UOM } from '../../../types';

export const useUOMs = (params?: any) => {
    return useQuery({
        queryKey: ['uoms', params],
        queryFn: () => UomService.getAll(params),
    });
};

export const useUOM = (id: string) => {
    return useQuery({
        queryKey: ['uoms', id],
        queryFn: () => UomService.getById(id),
        enabled: !!id,
    });
};

export const useCreateUOM = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<UOM>) => UomService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uoms'] });
            toast.success('Unit of Measurement created successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create Unit of Measurement.');
        }
    });
};

export const useUpdateUOM = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<UOM> }) =>
            UomService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uoms'] });
            toast.success('Unit of Measurement updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update Unit of Measurement.');
        }
    });
};

export const useDeleteUOM = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => UomService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uoms'] });
            toast.success('Unit of Measurement deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete Unit of Measurement.');
        }
    });
};
