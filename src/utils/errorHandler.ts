import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export interface ApiError {
    message: string;
    status?: number;
    data?: any;
    code?: string;
}

export const handleApiError = (error: unknown): ApiError => {
    console.log("error is here", error);
    let apiError: ApiError = {
        message: 'An unexpected error occurred. Please try again.',
    };

    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;

        if (axiosError.response) {
            apiError.status = axiosError.response.status;
            apiError.data = axiosError.response.data;

            if (axiosError.response.data) {
                if (typeof axiosError.response.data === 'string') {
                    apiError.message = axiosError.response.data;
                } else if (axiosError.response.data.message) {
                    apiError.message = axiosError.response.data.message;
                } else if (axiosError.response.data.error) {
                    apiError.message = axiosError.response.data.error;
                }
            }
        }
        else if (axiosError.request) {
            apiError.message = 'Unable to connect to the server. Please check your internet connection.';
            apiError.code = 'NETWORK_ERROR';
        }
    } else if (error instanceof Error) {
        apiError.message = error.message;
    } else if (typeof error === 'string') {
        apiError.message = error;
    }

    toast.error(apiError.message);

    return apiError;
};
