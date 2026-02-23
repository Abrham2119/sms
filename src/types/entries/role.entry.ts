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
    // Category management
    CREATE_CATEGORY: 'create_category',
    READ_CATEGORY: 'read_category',
    UPDATE_CATEGORY: 'update_category',
    DELETE_CATEGORY: 'delete_category',

    // Permission management
    CREATE_PERMISSION: 'create_permission',
    READ_PERMISSION: 'read_permission',
    UPDATE_PERMISSION: 'update_permission',
    DELETE_PERMISSION: 'delete_permission',

    // Product management
    CREATE_PRODUCT: 'create_product',
    READ_PRODUCT: 'read_product',
    UPDATE_PRODUCT: 'update_product',
    DELETE_PRODUCT: 'delete_product',

    // Purchase Order management
    CREATE_PURCHASE_ORDER: 'create_purchase_order',
    READ_PURCHASE_ORDER: 'read_purchase_order',
    UPDATE_PURCHASE_ORDER: 'update_purchase_order',
    DELETE_PURCHASE_ORDER: 'delete_purchase_order',

    // Purchase Order Item management
    CREATE_PURCHASE_ORDER_ITEM: 'create_purchase_order_item',
    READ_PURCHASE_ORDER_ITEM: 'read_purchase_order_item',
    UPDATE_PURCHASE_ORDER_ITEM: 'update_purchase_order_item',
    DELETE_PURCHASE_ORDER_ITEM: 'delete_purchase_order_item',

    // RFQ management
    CREATE_RFQ: 'create_request_for_quotation',
    READ_RFQ: 'read_request_for_quotation',
    UPDATE_RFQ: 'update_request_for_quotation',
    DELETE_RFQ: 'delete_request_for_quotation',

    // Role management
    CREATE_ROLE: 'create_role',
    READ_ROLE: 'read_role',
    UPDATE_ROLE: 'update_role',
    DELETE_ROLE: 'delete_role',
    READ_ROLES: 'read_roles',

    // Supplier management
    CREATE_SUPPLIER: 'create_supplier',
    READ_SUPPLIER: 'read_supplier',
    UPDATE_SUPPLIER: 'update_supplier',
    DELETE_SUPPLIER: 'delete_supplier',
    APPROVE_SUPPLIER: 'approve_supplier',
    SUSPEND_SUPPLIER: 'suspend_supplier',
    BLACKLIST_SUPPLIER: 'blacklist_supplier',

    // Supplier Details
    CREATE_SUPPLIER_ADDRESS: 'create_supplier_address',
    READ_SUPPLIER_ADDRESS: 'read_supplier_address',
    UPDATE_SUPPLIER_ADDRESS: 'update_supplier_address',
    DELETE_SUPPLIER_ADDRESS: 'delete_supplier_address',

    CREATE_SUPPLIER_CONTACT: 'create_supplier_contact',
    READ_SUPPLIER_CONTACT: 'read_supplier_contact',
    UPDATE_SUPPLIER_CONTACT: 'update_supplier_contact',
    DELETE_SUPPLIER_CONTACT: 'delete_supplier_contact',

    CREATE_SUPPLIER_EVALUATION: 'create_supplier_evaluation',
    READ_SUPPLIER_EVALUATION: 'read_supplier_evaluation',
    UPDATE_SUPPLIER_EVALUATION: 'update_supplier_evaluation',
    DELETE_SUPPLIER_EVALUATION: 'delete_supplier_evaluation',

    CREATE_SUPPLIER_PRODUCT: 'create_supplier_product',
    READ_SUPPLIER_PRODUCT: 'read_supplier_product',
    UPDATE_SUPPLIER_PRODUCT: 'update_supplier_product',
    DELETE_SUPPLIER_PRODUCT: 'delete_supplier_product',

    // Quotation management
    CREATE_QUOTATION: 'create_supplier_quotation',
    READ_QUOTATION: 'read_supplier_quotation',
    UPDATE_QUOTATION: 'update_supplier_quotation',
    DELETE_QUOTATION: 'delete_supplier_quotation',

    CREATE_QUOTATION_ITEM: 'create_supplier_quotation_item',
    READ_QUOTATION_ITEM: 'read_supplier_quotation_item',
    UPDATE_QUOTATION_ITEM: 'update_supplier_quotation_item',
    DELETE_QUOTATION_ITEM: 'delete_supplier_quotation_item',

    // User management
    CREATE_USER: 'create_user',
    READ_USER: 'read_user',
    UPDATE_USER: 'update_user',
    DELETE_USER: 'delete_user',
    ASSIGN_ROLE: 'assign_role',

    // Meta assignments
    ATTACH_PERMISSION: 'attach_permission',
    DETACH_PERMISSION: 'detach_permission',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
