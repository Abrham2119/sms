import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../../../store/authStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://smug.bililo.com/api';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);
