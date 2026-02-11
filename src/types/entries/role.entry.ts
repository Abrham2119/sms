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
    // Permission management
    CREATE_PERMISSION: 'create_permission',
    READ_PERMISSION: 'read_permission',
    UPDATE_PERMISSION: 'update_permission',
    DELETE_PERMISSION: 'delete_permission',

    // Role management
    CREATE_ROLE: 'create_role',
    READ_ROLE: 'read_role',
    UPDATE_ROLE: 'update_role',
    DELETE_ROLE: 'delete_role',
    READ_ROLES: 'read_roles',

    // User management
    CREATE_USER: 'create_user',
    READ_USER: 'read_user',
    UPDATE_USER: 'update_user',
    DELETE_USER: 'delete_user',
    ASSIGN_ROLE: 'assign_role',

    // Permission assignment
    ATTACH_PERMISSION: 'attach_permission',
    DETACH_PERMISSION: 'detach_permission',

    // Category management
    CREATE_CATEGORY: 'create_category',
    READ_CATEGORY: 'read_category',
    UPDATE_CATEGORY: 'update_category',
    DELETE_CATEGORY: 'delete_category',

    // Product management
    CREATE_PRODUCT: 'create_product',
    READ_PRODUCT: 'read_product',
    UPDATE_PRODUCT: 'update_product',
    DELETE_PRODUCT: 'delete_product',

       // Supplier management
    CREATE_SUPPLIER: 'create_supplier',
    READ_SUPPLIER: 'read_supplier',
    UPDATE_SUPPLIER: 'update_supplier',
    DELETE_SUPPLIER: 'delete_supplier',

    // Request management
    CREATE_REQUEST: 'create_request',
    READ_REQUEST: 'read_request',
    UPDATE_REQUEST: 'update_request',
    DELETE_REQUEST: 'delete_request',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
