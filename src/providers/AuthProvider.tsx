import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    return (
        <>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};
