import { api } from '../client/axios';
import type {
    LedgerEntry,
    TransactionStatus,
    LoanApplication,
} from '../../../domain/entities/account.entity';

export class AccountService {
    static async getMyAccounts(params?: any) {
        const response = await api.get('/accounts/my-accounts', { params });
        return response.data;
    }

    static async getAccountLedger(accountId: string, params?: {
        page?: number;
        per_page?: number;
        search?: string;
    }) {
        const response = await api.get<{
            success: boolean;
            data: {
                ledger: LedgerEntry[];
                pagination?: any
            }
        }>(`/accounts/ledger/${accountId}`, { params });
        return response.data;
    }

    static async getTransactionStatus(accountId: string) {
        const response = await api.get<{
            success: boolean;
            data: TransactionStatus
        }>(`/transactions/status/${accountId}`);
        return response.data;
    }

    static async getAccountLoans(params?: { account_id?: string }) {
        const response = await api.get<{
            success: boolean;
            data: LoanApplication[]
        }>('/loan-applications/loans', { params });
        return response.data;
    }

    static async deposit(accountId: string, data: {
        amount: number;
        remark?: string;
        channel: string;
        cheque_number?: string;
    }) {
        const response = await api.post(`/transactions/deposit/${accountId}`, data);
        return response.data;
    }

    static async withdraw(accountId: string, data: {
        amount: number;
        remark?: string;
        channel: string;
        cheque_number?: string;
    }) {
        const response = await api.post(`/transactions/withdraw/${accountId}`, data);
        return response.data;
    }

    static async applyForLoan(data: {
        account_id: string;
        amount: number;
        reason: string;
    }) {
        const response = await api.post('/loan-applications', data);
        return response.data;
    }
}
