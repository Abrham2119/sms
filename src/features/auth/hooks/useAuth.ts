import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import { useAuthStore } from '../../../store/authStore';
import type { LoginResponse } from '../../../types';
import { handleApiError } from '../../../utils/errorHandler';

export const useAuth = () => {
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const loginMutation = useMutation({
        mutationFn: async (credentials: any) => {
            const response = await api.post<LoginResponse>('/auth/login-member', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            if (data.success && data.data) {
                const { member } = data.data;
                // login(member, access_token); // PATCH: updated signature
                login(member.email, 'viewer'); // Default role for member registration
                navigate(from, { replace: true });
            } else {
                throw new Error(data.message || 'Login failed');
            }
        },
        onError: (error) => {
            handleApiError(error);
        },
    });

    return {
        login: loginMutation,
    };
};
