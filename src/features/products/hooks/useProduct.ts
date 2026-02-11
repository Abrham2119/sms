import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ProductService } from '../api/productService';
import type { Product } from '../../../types';

export const useProducts = (params?: any) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => ProductService.getAll(params),
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: () => ProductService.getById(id),
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Product>) => ProductService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product created successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create product.');
        }
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
            ProductService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update product.');
        }
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => ProductService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete product.');
        }
    });
};
