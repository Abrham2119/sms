import { create } from 'zustand';
import type { Supplier, Request, AdminUser, RequestStatus } from '../types';

interface DataState {
    suppliers: Supplier[];
    requests: Request[];
    admins: AdminUser[];


    addSupplier: (supplier: Omit<Supplier, 'id' | 'joinedDate' | 'rating'>) => void;
    updateSupplier: (id: string, updates: Partial<Supplier>) => void;
    deleteSupplier: (id: string) => void;


    addRequest: (request: Omit<Request, 'id' | 'date' | 'status'>) => void;
    updateRequestStatus: (id: string, status: RequestStatus) => void;


    addAdmin: (admin: Omit<AdminUser, 'id' | 'lastLogin' | 'status'>) => void;
    updateAdminStatus: (id: string, status: "active" | "inactive") => void;
    deleteAdmin: (id: string) => void;
}



const initialRequests: Request[] = [];

const initialAdmins: AdminUser[] = [
    { id: 'a1', name: 'Super Admin', email: 'admin@demo.com', role: 'admin', lastLogin: '2023-11-21', status: 'active' },
    { id: 'a2', name: 'Manager User', email: 'manager@demo.com', role: 'admin', lastLogin: '2023-11-20', status: 'active' },
];

export const useDataStore = create<DataState>((set) => ({
    suppliers: [],
    requests: initialRequests,
    admins: initialAdmins,

    addSupplier: (supplier) => set((state) => ({
        suppliers: [...state.suppliers, {
            ...supplier,
            id: Math.random().toString(36).substr(2, 9),
            joinedDate: new Date().toISOString().split('T')[0],
            rating: 0
        }]
    })),

    updateSupplier: (id, updates) => set((state) => ({
        suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...updates } : s)
    })),

    deleteSupplier: (id) => set((state) => ({
        suppliers: state.suppliers.filter(s => s.id !== id)
    })),

    addRequest: (request) => set((state) => ({
        requests: [...state.requests, {
            ...request,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending',
            date: new Date().toISOString().split('T')[0]
        }]
    })),

    updateRequestStatus: (id, status) => set((state) => ({
        requests: state.requests.map(r => r.id === id ? { ...r, status } : r)
    })),

    addAdmin: (admin) => set((state) => ({
        admins: [...state.admins, {
            ...admin,
            id: Math.random().toString(36).substr(2, 9),
            lastLogin: 'Never',
            status: 'active'
        }]
    })),

    updateAdminStatus: (id, status) => set((state) => ({
        admins: state.admins.map(a => a.id === id ? { ...a, status } : a)
    })),

    deleteAdmin: (id) => set((state) => ({
        admins: state.admins.filter(a => a.id !== id)
    })),
}));
