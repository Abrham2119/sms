export interface InterestTier {
    id: string;
    interest_rate: number;
    threshold: number;
    created_at: string;
    updated_at: string;
}

export interface LoanTier {
    id: string;
    max_loan_amount: number;
    interest_rate: number;
    penalty_rate: number;
    required_months: number;
    max_loan_multiplier: number;
    threshold: number;
    created_at: string;
    updated_at: string;
}

export interface AccountType {
    id: string;
    name: string;
    saving_period: string;
    penalty_rate: number;
    interest_rate: number;
    interest_period: string;
    minimum_threshold: number;
    interest_tiers: InterestTier[];
    loan_tiers: LoanTier[];
    created_at: string;
    updated_at: string;
}

export interface Account {
    id: string;
    member_id: string;
    account_type_id: string;
    term_id: string;
    balance: number;
    initial_balance: number;
    number: string;
    status: string;
    saving_started_at: string;
    created_at: string;
    updated_at: string;
    account_type?: AccountType;
}

export interface LedgerEntry {
    id: string;
    account_id: string;
    transaction_type: string;
    amount: number;
    balance_after: number;
    remark?: string;
    type?: 'CREDIT' | 'DEBIT';
    created_at: string;
}

export interface TransactionStatus {
    days_left_for_payment: number;
    penalty_amount: number;
}

export interface LoanApplication {
    id: string;
    account_id: string;
    amount: number;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE';
    application_number: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data: {
        current_page: number;
        data: T[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}
