import type { BusinessUnit } from './businessUnit.entry';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status?: string;
    roles?: (string | { id: string, name: string })[];
    business_units?: BusinessUnit[];
    email_verified_at?: string;
    profile_picture?: string;
    created_at?: string;
    updated_at?: string;
}
