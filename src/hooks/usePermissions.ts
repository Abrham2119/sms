import { useAuthStore } from '../store/authStore';

export const usePermissions = () => {
    const { hasPermission } = useAuthStore();
    return { hasPermission };
};
