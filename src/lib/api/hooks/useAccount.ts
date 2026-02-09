import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountService } from '../services/account.service';
import { toast } from 'react-toastify';

export const useMyAccounts = (params?: any) => {
    return useQuery({
        queryKey: ['my-accounts', params],
        queryFn: () => AccountService.getMyAccounts(params),
    });
};

export const useAccountLedger = (accountId: string, params?: {
    page?: number;
    per_page?: number;
    search?: string;
}) => {
    return useQuery({
        queryKey: ['account-ledger', accountId, params],
        queryFn: () => AccountService.getAccountLedger(accountId, params),
        enabled: !!accountId,
    });
};

export const useAccountTransactionStatus = (accountId: string) => {
    return useQuery({
        queryKey: ['transaction-status', accountId],
        queryFn: () => AccountService.getTransactionStatus(accountId),
        enabled: !!accountId,
    });
};

export const useAccountLoans = (params?: { account_id?: string }) => {
    return useQuery({
        queryKey: ['account-loans', params],
        queryFn: () => AccountService.getAccountLoans(params),
    });
};

export const useCreateDeposit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ accountId, data }: { accountId: string; data: any }) =>
            AccountService.deposit(accountId, data),
        onSuccess: (_, variables) => {
            toast.success('Deposit successful');
            queryClient.invalidateQueries({ queryKey: ['account-ledger', variables.accountId] });
            queryClient.invalidateQueries({ queryKey: ['my-accounts'] });
            queryClient.invalidateQueries({ queryKey: ['transaction-status', variables.accountId] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Deposit failed');
        },
    });
};

export const useCreateWithdraw = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ accountId, data }: { accountId: string; data: any }) =>
            AccountService.withdraw(accountId, data),
        onSuccess: (_, variables) => {
            toast.success('Withdrawal successful');
            queryClient.invalidateQueries({ queryKey: ['account-ledger', variables.accountId] });
            queryClient.invalidateQueries({ queryKey: ['my-accounts'] });
            queryClient.invalidateQueries({ queryKey: ['transaction-status', variables.accountId] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Withdrawal failed');
        },
    });
};

export const useCreateLoanApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => AccountService.applyForLoan(data),
        onSuccess: () => {
            toast.success('Loan application submitted successfully');
            queryClient.invalidateQueries({ queryKey: ['account-loans'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to submit loan application');
        },
    });
};
