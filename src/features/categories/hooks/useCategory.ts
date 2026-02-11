import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { CategoryService } from '../api/categoryService';
import type { Category } from '../../../types';

export const useCategories = (params?: any) => {
    return useQuery({
        queryKey: ['categories', params],
        queryFn: () => CategoryService.getAll(params),
    });
};

export const useCategory = (id: string) => {
    return useQuery({
        queryKey: ['categories', id],
        queryFn: () => CategoryService.getById(id),
        enabled: !!id,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Category>) => CategoryService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create category.');
        }
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
            CategoryService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update category.');
        }
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => CategoryService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete category.');
        }
    });
};
