import type { PaginatedResponse } from "./common.entry";

export interface BusinessUnit {
    id: string;
    legal_name: string;
    trade_name: string;
    email: string;
    phone: string | null;
    tin: string;
    website: string | null;
    logo: string | null;
    type: 'local' | 'foreign';
    created_at: string;
}

export interface CreateBusinessUnitRequest {
    type: 'local' | 'foreign';
    legal_name: string;
    trade_name: string;
    email: string;
    tin: string;
    website?: string;
    logo?: File;
}

export type BusinessUnitResponse = PaginatedResponse<BusinessUnit>;
