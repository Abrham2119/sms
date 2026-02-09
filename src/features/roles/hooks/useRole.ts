import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { RoleService } from '../api/roleService';

export const useRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: () => RoleService.getRoles(),
    });
};

export const usePermissionsList = (options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['permissions'],
        queryFn: () => RoleService.getPermissions(),
        enabled: options?.enabled ?? true,
    });
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { name: string; permissions: string[] }) => RoleService.createRole(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            toast.success('Role created successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to create role.');
        }
    });
};

export const useUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ uuid, data }: { uuid: string; data: { name: string; permissions: string[] } }) =>
            RoleService.updateRole(uuid, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            toast.success('Role updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to update role.');
        }
    });
};

export const useDeleteRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (uuid: string) => RoleService.deleteRole(uuid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            toast.success('Role deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to delete role.');
        }
    });
};
