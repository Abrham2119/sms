import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { SupplierService } from '../api/supplierService';
import type { Supplier } from '../../../types';

export const useSuppliers = (params?: any) => {
    return useQuery({
        queryKey: ['suppliers', params],
        queryFn: () => SupplierService.getAll(params),
    });
};

export const useSupplier = (id: string) => {
    return useQuery({
        queryKey: ['suppliers', id],
        queryFn: () => SupplierService.getById(id),
        enabled: !!id,
    });
};

export const useCreateSupplier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Supplier>) => SupplierService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            toast.success('Supplier created successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create supplier.');
        }
    });
};

export const useUpdateSupplier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Supplier> }) =>
            SupplierService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            toast.success('Supplier updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update supplier.');
        }
    });
};

export const useDeleteSupplier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => SupplierService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            toast.success('Supplier deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete supplier.');
        }
    });
};

export const useApproveSupplier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => SupplierService.approve(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            toast.success('Supplier approved successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to approve supplier.');
        }
    });
};

export const useSuspendSupplier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => SupplierService.suspend(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            toast.success('Supplier suspended successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to suspend supplier.');
        }
    });
};

export const useBlacklistSupplier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => SupplierService.blacklist(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            toast.success('Supplier blacklisted successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to blacklist supplier.');
        }
    });
};

export const useUploadSupplierAttachments = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, files }: { id: string; files: File[] }) =>
            SupplierService.uploadAttachments(id, files),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            toast.success('Attachments uploaded successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to upload attachments.');
        }
    });
};

export const useLinkedProducts = (id: string, params?: any) => {
    return useQuery({
        queryKey: ['suppliers', id, 'products', params],
        queryFn: () => SupplierService.getLinkedProducts(id, params),
        enabled: !!id,
    });
};

export const useLinkProducts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ supplierId, productIds }: { supplierId: string; productIds: string[] }) =>
            SupplierService.linkProducts(supplierId, productIds),
        onSuccess: (_, { supplierId }) => {
            queryClient.invalidateQueries({ queryKey: ['suppliers', supplierId, 'products'] });
            toast.success('Products linked successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to link products.');
        }
    });
};

export const useUnlinkProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ supplierId, productId }: { supplierId: string; productId: string }) =>
            SupplierService.unlinkProduct(supplierId, productId),
        onSuccess: (_, { supplierId }) => {
            queryClient.invalidateQueries({ queryKey: ['suppliers', supplierId, 'products'] });
            toast.success('Product unlinked successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to unlink product.');
        }
    });
};