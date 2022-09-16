import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface IDashboardTransactionResponse {
    from: string;
    message: string;
    amount: string;
    exchangeRate: string;
    proceeds: string;
    fee: string;
}

export const DashboardTransactionResponseSchema: JTDSchemaType<IDashboardTransactionResponse> = {
    properties: {
        from: { type: "string" },
        message: { type: "string" },
        amount: { type: "string" },
        exchangeRate: { type: "string" },
        proceeds: { type: "string" },
        fee: { type: "string" }
    }
};

export interface IDashboardTransactionsResponse {
    transactions: Array<IDashboardTransactionResponse>;
}

export const DashboardTransactionsResponseSchema: JTDSchemaType<IDashboardTransactionsResponse> = {
    properties: {
        transactions: {
            elements: DashboardTransactionResponseSchema
        }
    }
};

export interface IDashboardOverviewResponse {
    cumlative: string;
    pending: string;
    nextPaymentDate: number;
}

export const DashboardOverviewResponseSchema: JTDSchemaType<IDashboardOverviewResponse> = {
    properties: {
        cumlative: { type: "string" },
        pending: { type: "string" },
        nextPaymentDate: { type: "int32" }
    }
};
