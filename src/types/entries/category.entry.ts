export interface Category {
    id: string;
    name: string;
    parent_id: string | null;
    parent?: {
        id: string;
        name: string;
    };
    description?: string;
    children?: Category[];
    created_at?: string;
    updated_at?: string;
}
