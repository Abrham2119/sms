import type { Category } from './category.entry.ts';
import type { UOM } from './uom.entry.ts';

export interface Product {
    id: string;
    name: string;
    code: string;
    category_id: string;
    uom_id: string;
    description: string;
    is_active: boolean | string;
    quantity?: string;
    category?: Category;
    uom?: UOM;
    created_at?: string;
    updated_at?: string;
    price?: number;
}
