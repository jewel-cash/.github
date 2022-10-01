import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface IDashboardTransactionResponse {
    from: string;
    message: string;
    amount: number;
    currency: string;
    exchangeRate: number;
    proceeds: number;
    fee: number;
}

export const DashboardTransactionResponseSchema: JTDSchemaType<IDashboardTransactionResponse> = {
    properties: {
        from: { type: "string" },
        message: { type: "string" },
        amount: { type: "float32" },
        currency: { type: "string" },
        exchangeRate: { type: "float32" },
        proceeds: { type: "float32" },
        fee: { type: "float32" }
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
    cumlative: number;
    pending: number;
    nextPaymentDate: number;
}

export const DashboardOverviewResponseSchema: JTDSchemaType<IDashboardOverviewResponse> = {
    properties: {
        cumlative: { type: "float32" },
        pending: { type: "float32" },
        nextPaymentDate: { type: "int32" }
    }
};
