export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status?: string;
    roles?: (string | { id: string, name: string })[];
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}
