import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface IAdminOverviewResponse {
    users: string;
    payedOut: string;
    pendingPayments: string;
    feesCollected: string;
    unearnedFees: string;
    nextPaymentDate: number;
}

export const AdminOverviewResponseSchema: JTDSchemaType<IAdminOverviewResponse> = {
    properties: {
        users: { type: "string" },
        payedOut: { type: "string" },
        pendingPayments: { type: "string" },
        feesCollected: { type: "string" },
        unearnedFees: { type: "string" },
        nextPaymentDate: { type: "int32" }
    }
};

export interface IAdminTransactionResponse {
    recipient: string;
    amount: string;
    exchangeRate: string;
    proceeds: string;
    fee: string;
}

export const AdminTransactionResponseSchema: JTDSchemaType<IAdminTransactionResponse> = {
    properties: {
        recipient: { type: "string" },
        amount: { type: "string" },
        exchangeRate: { type: "string" },
        proceeds: { type: "string" },
        fee: { type: "string" }
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
    payedOut: string;
    pending: string;
    fees: string;
    unearnedFees: string;
}

export const AdminUserResponseSchema: JTDSchemaType<IAdminUserResponse> = {
    properties: {
        userId: { type: "string" },
        payedOut: { type: "string" },
        pending: { type: "string" },
        fees: { type: "string" },
        unearnedFees: { type: "string" }
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
