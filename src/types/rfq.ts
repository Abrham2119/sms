export interface RFQ {
    id: string;
    reference_number: string;
    description: string;
    submission_deadline: string;
    delivery_terms: string[];
    delivery_location: string;
    for: 'all' | 'local' | 'foreign';
    status: string;
    created_at: string;
    updated_at: string;
    created_by?: string;
    products?: RFQProduct[];
    pivot?: {
        supplier_id: string;
        request_for_quotation_id: string;
        status: 'draft' | 'submitted' | 'withdrawn' | 'shortlisted' | 'awarded' | 'rejected';
        total_amount: string | null;
        quotation_number: string | null;
        submitted_at: string | null;
        currency: string;
        notes: string | null;
        created_at: string;
        updated_at: string;
    };
}

export interface RFQProduct {
    id: string;
    name: string;
    category_id: string;
    description: string;
    is_active: string;
    created_at: string;
    updated_at: string;
    pivot: {
        request_for_quotation_id: string;
        product_id: string;
        quantity: string;
        specifications: string | null;
        created_at: string;
        updated_at: string;
    };
}

export interface CreateRFQRequest {
    description: string;
    submission_deadline: string;
    delivery_terms: string[];
    delivery_location: string;
    for: 'all' | 'local' | 'foreign';
}

export interface AttachProductsRequest {
    products: {
        product_id: string;
        quantity: number;
        specifications?: string;
    }[];
}

export interface RFQResponse {
    message: string;
    data: RFQ;
}

export interface QuotationItem {
    id: string;
    supplier_quotation_id: string;
    product_id: string;
    quantity: string;
    unit_price: string;
    total_price: string;
    lead_time_days: string | null;
    remarks: string | null;
    discount: number;
    warranty_available: boolean;
    warranty_duration: string;
    warranty_details: string;
    product: {
        id: string;
        name: string;
        description: string;
    };
}

export interface Quotation {
    id: string;
    request_for_quotation_id: string;
    supplier_id: string;
    quotation_number: string;
    total_amount: string;
    currency: string;
    notes: string | null;
    minimum_order_quantity: string;
    lead_time_days: string;
    is_evaluated?: boolean
    proforma_validity_date: string;
    delivery_method: string;
    warranty_details: string;
    credit_amount: number;
    credit_available: string;
    credit_period_days: string;
    availability_status: string;
    additional_terms: string;
    status: 'submitted' | 'accepted' | 'rejected' | 'shortlisted' | 'awarded';
    submitted_at: string;
    created_at: string;
    updated_at: string;
    supplier: {
        id: string;
        legal_name: string;
        trade_name: string;
        email: string | null;
        phone: string | null;
    };
    items: QuotationItem[];
}

export interface Evaluation {
    id: string;
    supplier_quotation_id: string;
    price_score: string;
    delivery_score: string;
    financial_score: string;
    performance_score: string;
    compliance_score: string;
    total_score: string;
    is_shortlisted: boolean;
    created_at: string;
    updated_at: string;
    quotation?: Quotation | null;
}

export interface RFQQuotationRecord {
    id: string;
    quotation_id: string;
    is_shortlisted: boolean;
    is_awarded: boolean;
    price_score: string | null;
    delivery_score: string | null;
    financial_score: string | null;
    performance_score: string | null;
    compliance_score: string | null;
    total_score: string | null;
    created_at: string;
    updated_at: string;
    quotation: Quotation;
}

export interface RFQQuotationsResponse {
    rfq_awarded: boolean;
    current_page: number;
    data: RFQQuotationRecord[];
    total: number;
    per_page: number;
    last_page: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
