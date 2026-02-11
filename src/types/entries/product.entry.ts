import type { Category } from './category.entry.ts';

export interface Product {
    id: string;
    name: string;
    category_id: string;
    description: string;
    is_active: boolean;
    category?: Category;
    created_at?: string;
    updated_at?: string;
    price?: number;
    stock?: number;
}
