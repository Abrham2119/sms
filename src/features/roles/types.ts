export interface Permission {
    uuid: string;
    name: string;
    description?: string;
    group?: string;
}

export interface Role {
    uuid: string;
    name: string;
    users_count: number;
    three_users_profile_image: (string | null)[];
    permissions_count: number;
    permissions: Permission[];
}

export interface RoleApiResponse<T> {
    success: boolean;
    status: number;
    data: T;
}
