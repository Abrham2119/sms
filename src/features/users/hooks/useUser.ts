import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { UserService } from '../api/userService';
import type { User } from '../../../types';

export const useUsers = (params?: any) => {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => UserService.getAll(params),
    });
};

export const useUser = (id: string) => {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => UserService.getById(id),
        enabled: !!id,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<User> & { password?: string; password_confirmation?: string; roles?: string[] }) => UserService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User created successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create user.');
        }
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<User> & { password?: string; password_confirmation?: string; roles?: string[] } }) =>
            UserService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update user.');
        }
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => UserService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete user.');
        }
    });
};

export const useAssignRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) => UserService.assignRole(userId, roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Role assigned successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to assign role.');
        }
    });
};

export const useToggleUserStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, status }: { userId: string; status: "active" | "inactive" }) => UserService.toggleStatus(userId, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success(`User set to ${variables.status} successfully!`);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to change user status.');
        }
    });
};

export const useUserActivities = (id: string, params?: any) => {
    return useQuery({
        queryKey: ['user-activities', id, params],
        queryFn: () => UserService.getActivities(id, params),
        enabled: !!id,
    });
};
