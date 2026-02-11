export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    first_page_url?: string;
    last_page_url?: string;
    next_page_url?: string | null;
    prev_page_url?: string | null;
    path?: string;
    links?: {
        url: string | null;
        label: string;
        active: boolean;
        page?: number | null;
    }[];
}

export interface ApiResponse<T> {
    message: string;
    data: T;
}
