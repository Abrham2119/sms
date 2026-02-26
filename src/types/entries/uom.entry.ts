export interface UOM {
    id: string;
    name: string;
    abbreviation: string;
    description: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}
