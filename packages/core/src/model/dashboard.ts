export interface IDashboardTransactionsResponse {
    transactions: Array<IDashboardTransactionResponse>;
}

export interface IDashboardTransactionResponse {
    from: string;
    message: string;
    amount: string;
    exchangeRate: string;
    proceeds: string;
    fee: string;
}

export interface IDashboardOverviewResponse {
    cumlative: string;
    pending: string;
    nextPaymentDate: number;
}