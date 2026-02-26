import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { SupplierService } from '../api/supplierService';
import { UserService } from '../../users/api/userService';
import type { Supplier, SupplierProfile } from '../../../types';

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

export const useSupplierAttachments = (id: string, params?: any) => {
    return useQuery({
        queryKey: ['suppliers', id, 'attachments', params],
        queryFn: () => SupplierService.getAttachments(id, params),
        enabled: !!id,
    });
};

export const useUploadSupplierAttachments = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, attachments }: { id: string; attachments: { file: File, expires_at?: string }[] }) =>
            SupplierService.uploadAttachments(id, attachments),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['suppliers', id, 'attachments'] });
            toast.success('Attachments uploaded successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to upload attachments.');
        }
    });
};

export const useUpdateSupplierAttachment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ supplierId, attachmentId, data }: { supplierId: string; attachmentId: string | number, data: { expires_at?: string | null } }) =>
            SupplierService.updateAttachment(supplierId, attachmentId, data),
        onSuccess: (_, { supplierId }) => {
            queryClient.invalidateQueries({ queryKey: ['suppliers', supplierId, 'attachments'] });
            toast.success('Attachment updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update attachment.');
        }
    });
};

export const useDeleteSupplierAttachment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ supplierId, attachmentId }: { supplierId: string; attachmentId: string | number }) =>
            SupplierService.deleteAttachment(supplierId, attachmentId),
        onSuccess: (_, { supplierId }) => {
            queryClient.invalidateQueries({ queryKey: ['suppliers', supplierId, 'attachments'] });
            toast.success('Attachment deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete attachment.');
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
        mutationFn: ({ supplierId, productIds }: { supplierId: string; productIds: string[] }) =>
            SupplierService.unlinkProduct(supplierId, productIds),
        onSuccess: (_, { supplierId }) => {
            queryClient.invalidateQueries({ queryKey: ['suppliers', supplierId, 'products'] });
            toast.success('Products unlinked successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to unlink product.');
        }
    });
};

// Hooks for authenticated supplier's own products
export const useMyProducts = (params?: any) => {
    return useQuery({
        queryKey: ['my-products', params],
        queryFn: () => SupplierService.getMyProducts(params),
    });
};

export const useMyProduct = (id: string) => {
    return useQuery({
        queryKey: ['my-products', id],
        queryFn: () => SupplierService.getMyProductById(id),
        enabled: !!id,
    });
};

export const useMyLinkedProducts = (supplierId: string, params?: any) => {
    return useQuery({
        queryKey: ['my-linked-products', supplierId, params],
        queryFn: () => SupplierService.getMyLinkedProducts(supplierId, params),
        enabled: !!supplierId,
    });
};

export const useLinkMyProducts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ supplierId, productIds }: { supplierId: string; productIds: string[] }) =>
            SupplierService.linkMyProducts(supplierId, productIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-linked-products'] });
            toast.success('Products linked successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to link products.');
        }
    });
};

export const useUnlinkMyProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ supplierId, productId }: { supplierId: string; productId: string }) =>
            SupplierService.unlinkMyProduct(supplierId, productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-linked-products'] });
            toast.success('Product unlinked successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to unlink product.');
        }
    });
};

export const useMyProfile = () => {
    return useQuery({
        queryKey: ['my-profile'],
        queryFn: () => SupplierService.getProfile(),
    });
};

export const useUpdateMyProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<SupplierProfile>) => SupplierService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-profile'] });
            toast.success('Profile updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update profile.');
        }
    });
};

export const useUpdateProfilePicture = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, file }: { userId: string, file: File }) => UserService.updateProfilePicture(userId, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-profile'] });
            toast.success('Profile picture updated!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update profile picture.');
        }
    });
};

export const useSupplierActivities = (id: string, params?: any) => {
    return useQuery({
        queryKey: ['supplier-activities', id, params],
        queryFn: () => SupplierService.getActivities(id, params),
        enabled: !!id,
    });
};