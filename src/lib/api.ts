import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const BASE_URL = 'http://84.247.174.210:8081/api/v1';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
});
