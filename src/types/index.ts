export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const MemberStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    SUSPENDED: "SUSPENDED",
    PENDING: "PENDING",
} as const;
export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus];

export const MarriageStatus = {
    SINGLE: "SINGLE",
    MARRIED: "MARRIED",
    DIVORCED: "DIVORCED",
    WIDOWED: "WIDOWED",
} as const;
export type MarriageStatus = (typeof MarriageStatus)[keyof typeof MarriageStatus];

export const AccountStatus = {
    ACTIVE: "ACTIVE",
    DORMANT: "DORMANT",
    CLOSED: "CLOSED",
} as const;
export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];

export interface Branch {
    id: string;
    branch_code: string;
    name: string;
    is_head_quarter: boolean;
    email: string;
    phone_number: string;
    region: string;
    city: string;
    address: string;
    country: string;
    zip_code: string;
    latitude: number;
    longitude: number;
    opening_date: string;
    operational_hours: string;
    branch_type: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface Account {
    id: string;
    member_id: string;
    account_type_id: string;
    term_id: string;
    balance: number;
    initial_balance: number;
    number: string;
    status: string;
    saving_started_at: string;
    created_at: string;
    updated_at: string;
}

export interface Member {
    id: string;
    full_name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    monthly_income: number;
    gender: string;
    age: number;
    registration_fee: number;
    membership_number: string;
    status: string;
    phone_number: string;
    branch_id: string;
    branch: Branch;
    birth_place: string;
    birth_district: string;
    birth_neighborhood: string;
    birth_zone: string;
    birth_subcity: string;
    birth_region: string;
    birth_house_number: string;
    current_region: string;
    current_district: string;
    current_neighborhood: string;
    current_zone: string;
    current_subcity: string;
    current_house_number: string;
    number_of_children_boys: number;
    number_of_children_girls: number;
    marriage_status: string;
    spouse_name: string;
    photo: string;
    id_photo: string;
    method_of_identification: string;
    identification_number: string;
    children: any[] | null;
    heirs: any[] | null;
    emergency_contacts: any[] | null;
    created_at: string;
    updated_at: string;
    accounts: Account[];
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponseData {
    access_token: string;
    identity_type: "member";
    member: Member;
}

export interface LoginResponse {
    success: boolean;
    status: number;
    message: string;
    data: LoginResponseData;
}

// Supplier Management Dashboard Types

// Permissions & Roles

export interface PermissionEntity {
    uuid: string;
    name: string;
}

export interface Role {
    uuid: string;
    name: string;
    permissions: PermissionEntity[];
}

export const PERMISSIONS = {
    CREATE_PERMISSION: 'create_permission',
    READ_PERMISSION: 'read_permission',
    UPDATE_PERMISSION: 'update_permission',
    DELETE_PERMISSION: 'delete_permission',
    CREATE_ROLE: 'create_role',
    READ_ROLE: 'read_role',
    UPDATE_ROLE: 'update_role',
    DELETE_ROLE: 'delete_role',
    CREATE_USER: 'create_user',
    READ_USER: 'read_user',
    UPDATE_USER: 'update_user',
    DELETE_USER: 'delete_user',
    ASSIGN_ROLE: 'assign_role',
    ATTACH_PERMISSION: 'attach_permission',
    DETACH_PERMISSION: 'detach_permission',
    READ_ROLES: 'read_roles',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    roles: string[];
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        access_token: string;
        token_type: string;
        expires_in: number;
        user: User;
        roles: Role[];
    };
}

export type SupplierStatus = "active" | "inactive" | "pending" | "blacklisted";
export type SupplierCategory = "electronics" | "furniture" | "office_supplies" | "services" | "other";

export interface Supplier {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    status: SupplierStatus;
    rating: number; // 1-5
    joinedDate: string;
    category: SupplierCategory;
}

export type RequestStatus = "pending" | "approved" | "rejected";
export type RequestType = "new_item" | "restock" | "pricing_update" | "partnership";

export interface Request {
    id: string;
    supplierId: string;
    supplierName: string;
    requestType: RequestType;
    status: RequestStatus;
    requestedBy: string;
    date: string;
    notes?: string;
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: "admin"; // Always admin for this table view
    lastLogin: string;
    status: "active" | "inactive";
}
