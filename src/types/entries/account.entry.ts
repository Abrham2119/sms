export const AccountStatus = {
    ACTIVE: "ACTIVE",
    DORMANT: "DORMANT",
    CLOSED: "CLOSED",
} as const;
export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];

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
}
