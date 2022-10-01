import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface IAdminOverviewResponse {
    uniqueUsers: number;
    payedOut: number;
    pendingPayments: number;
    feesCollected: number;
    unearnedFees: number;
    nextPaymentDate: number;
}

export const AdminOverviewResponseSchema: JTDSchemaType<IAdminOverviewResponse> = {
    properties: {
        uniqueUsers: { type: "int32" },
        payedOut: { type: "float32" },
        pendingPayments: { type: "float32" },
        feesCollected: { type: "float32" },
        unearnedFees: { type: "float32" },
        nextPaymentDate: { type: "int32" }
    }
};

export interface IAdminTransactionResponse {
    recipient: string;
    amount: number;
    currency: string;
    exchangeRate: number;
    proceeds: number;
    fee: number;
}

export const AdminTransactionResponseSchema: JTDSchemaType<IAdminTransactionResponse> = {
    properties: {
        recipient: { type: "string" },
        amount: { type: "float32" },
        currency: { type: "string" },
        exchangeRate: { type: "float32" },
        proceeds: { type: "float32" },
        fee: { type: "float32" }
    }
};

export interface IAdminTransactionsResponse {
    transactions: Array<IAdminTransactionResponse>;
}

export const AdminTransactionsResponseSchema: JTDSchemaType<IAdminTransactionsResponse> = {
    properties: {
        transactions: { 
            elements: AdminTransactionResponseSchema
        }
    }
};

export interface IAdminUserResponse {
    userId: string;
    payedOut: number;
    pending: number;
    fees: number;
    unearnedFees: number;
}

export const AdminUserResponseSchema: JTDSchemaType<IAdminUserResponse> = {
    properties: {
        userId: { type: "string" },
        payedOut: { type: "float32" },
        pending: { type: "float32" },
        fees: { type: "float32" },
        unearnedFees: { type: "float32" }
    }
};

export interface IAdminUsersResponse {
    users: Array<IAdminUserResponse>;
}

export const AdminUsersResponseSchema: JTDSchemaType<IAdminUsersResponse> = {
    properties: {
        users: { 
            elements: AdminUserResponseSchema
        }
    }
};
