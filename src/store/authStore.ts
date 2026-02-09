import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../lib/api/client/axios';
import type { User, Role, PermissionEntity, Permission, LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    roles: Role[];
    permissions: PermissionEntity[];
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    hasPermission: (permissionName: Permission) => boolean;
    setAuth: (user: User, token: string, roles: Role[]) => void;
    resetError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            roles: [],
            permissions: [],
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post<AuthResponse>('/v1/login', credentials);
                    const { user, access_token, roles } = response.data.data;


                    const permissions = roles.flatMap(role => role.permissions);

                    set({
                        user,
                        token: access_token,
                        roles,
                        permissions,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Login failed',
                        isLoading: false
                    });
                    throw error;
                }
            },

            register: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post<AuthResponse>('/v1/register', credentials);
                    const { user, access_token, roles } = response.data.data;

                    const permissions = roles.flatMap(role => role.permissions);

                    set({
                        user,
                        token: access_token,
                        roles,
                        permissions,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Registration failed',
                        isLoading: false
                    });
                    throw error;
                }
            },

            logout: async () => {
                set({ isLoading: true, error: null });
                try {
                    await api.post('/v1/logout');
                } catch (error) {
                    console.error('Logout failed', error);
                } finally {
                    set({
                        user: null,
                        token: null,
                        roles: [],
                        permissions: [],
                        isAuthenticated: false,
                        isLoading: false
                    });
                }
            },

            hasPermission: (permissionName: Permission) => {
                const { permissions } = get();
                return permissions.some(p => p.name === permissionName);
            },

            setAuth: (user, token, roles) => {
                const permissions = roles.flatMap(role => role.permissions);
                set({
                    user,
                    token,
                    roles,
                    permissions,
                    isAuthenticated: true,
                    isLoading: false
                });
            },

            resetError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                roles: state.roles,
                permissions: state.permissions,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
