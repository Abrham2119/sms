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
    type: 'local' | 'foreign';
    logo?: string;
    status: 'active' | 'inactive' | 'suspended' | 'blacklisted';
    contacts: Contact[];
    addresses: Address[];
    created_at?: string;
    updated_at?: string;
}

export interface SupplierProfile {
    id: string;
    user_id: string;
    legal_name: string;
    email: string | null;
    trade_name: string;
    tin: string | null;
    vat_number: string | null;
    registration_number: string | null;
    license_number: string | null;
    website: string | null;
    phone: string | null;
    status: string;
    submitted_at: string | null;
    approved_at: string | null;
    approved_by: string | null;
    blacklisted_at: string | null;
    blacklist_reason: string | null;
    is_active: string;
    meta: any;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface SupplierProfileResponse {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    profile_picture: string | null;
    created_at: string;
    updated_at: string;
    supplier_profile: SupplierProfile;
}
