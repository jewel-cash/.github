export interface IAdminOverviewResponse {
    users: string;
    payedOut: string;
    pendingPayments: string;
    feesCollected: string;
    unearnedFees: string;
    nextPaymentDate: number;
}

export interface IAdminTransactionsResponse {
    transactions: Array<IAdminTransactionResponse>;
}

export interface IAdminTransactionResponse {
    recipient: string;
    amount: string;
    exchangeRate: string;
    proceeds: string;
    fee: string;
}

export interface IAdminUsersResponse {
    users: Array<IAdminUserResponse>;
}

export interface IAdminUserResponse {
    userId: string;
    payedOut: string;
    pending: string;
    fees: string;
    unearnedFees: string;
}

