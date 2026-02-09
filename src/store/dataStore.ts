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


const initialSuppliers: Supplier[] = [
    { id: '1', companyName: 'TechSource Solutions', contactPerson: 'John Doe', email: 'john@techsource.com', phone: '+1 555-0123', address: '123 Tech Blvd, Silicon Valley', status: 'active', rating: 4.8, joinedDate: '2023-01-15', category: 'electronics' },
    { id: '2', companyName: 'Office Depot Pro', contactPerson: 'Sarah Smith', email: 'contact@officedepot.com', phone: '+1 555-0199', address: '456 Market St, New York', status: 'active', rating: 4.5, joinedDate: '2023-03-20', category: 'office_supplies' },
    { id: '3', companyName: 'Furniture World', contactPerson: 'Mike Johnson', email: 'sales@furnitureworld.com', phone: '+1 555-0456', address: '789 Oak Ave, Chicago', status: 'pending', rating: 0, joinedDate: '2023-11-05', category: 'furniture' },
    { id: '4', companyName: 'Global Services Group', contactPerson: 'Emma Wilson', email: 'emma@globalservices.com', phone: '+1 555-0789', address: '101 Service Rd, Seattle', status: 'inactive', rating: 3.9, joinedDate: '2022-12-10', category: 'services' },
    { id: '5', companyName: 'ElectroParts Inc.', contactPerson: 'David Brown', email: 'david@electroparts.com', phone: '+1 555-2222', address: '202 Circuit Ln, Austin', status: 'active', rating: 4.2, joinedDate: '2023-06-15', category: 'electronics' },
];

const initialRequests: Request[] = [
    { id: '101', supplierId: '1', supplierName: 'TechSource Solutions', requestType: 'new_item', status: 'pending', requestedBy: 'Manager One', date: '2023-11-20', notes: 'Requesting to include new SSD model.' },
    { id: '102', supplierId: '2', supplierName: 'Office Depot Pro', requestType: 'restock', status: 'approved', requestedBy: 'Manager One', date: '2023-11-18' },
    { id: '103', supplierId: '2', supplierName: 'Office Depot Pro', requestType: 'pricing_update', status: 'rejected', requestedBy: 'Admin User', date: '2023-11-15', notes: 'Proposed pricing is too high.' },
    { id: '104', supplierId: '5', supplierName: 'ElectroParts Inc.', requestType: 'partnership', status: 'approved', requestedBy: 'Admin User', date: '2023-10-01' },
];

const initialAdmins: AdminUser[] = [
    { id: 'a1', name: 'Super Admin', email: 'admin@demo.com', role: 'admin', lastLogin: '2023-11-21', status: 'active' },
    { id: 'a2', name: 'Manager User', email: 'manager@demo.com', role: 'admin', lastLogin: '2023-11-20', status: 'active' },
];

export const useDataStore = create<DataState>((set) => ({
    suppliers: initialSuppliers,
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
