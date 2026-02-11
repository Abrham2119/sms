export interface Contact {
    id?: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    is_primary: boolean;
}

export interface Address {
    id?: string;
    type: string;
    country: string;
    city: string;
    address_line1: string;
    address_line2?: string;
    state?: string;
    postal_code?: string;
}

export interface Supplier {
    id: string;
    legal_name: string;
    trade_name: string;
    email: string;
    tin: string;
    website?: string;
    status: 'active' | 'inactive' | 'suspended' | 'blacklisted';
    contacts: Contact[];
    addresses: Address[];
    created_at?: string;
    updated_at?: string;
}
