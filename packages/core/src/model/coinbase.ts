import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface ICoinbaseAccount {
    id: string; 
    primary: boolean;
    currency: { 
        code: string; 
        color: string;
        slug?: string;
        type: string;
        name: string;
        sort_index: number;
    };
} 

export const CoinbaseAccountSchema: JTDSchemaType<ICoinbaseAccount> = {
    properties: {
        id: { type: "string" },
        primary: { type: "boolean" },
        currency: {
            properties: {
                code: { type: "string" },
                color: { type: "string" },
                type: { type: "string" },
                name: { type: "string" },
                sort_index: { type: "int32" }
            },
            optionalProperties: {
                slug: { type: "string" }
            },
            additionalProperties: true
        }
    },
    additionalProperties: true
};

export interface ICoinbaseAccounts { 
    pagination: {
        next_uri: string | null;
    };
    data: Array<ICoinbaseAccount>;
}

export const CoinbaseAccountsSchema: JTDSchemaType<ICoinbaseAccounts> = {
    properties: {
        pagination: {
            properties: {
                next_uri: { type: "string", nullable: true }
            },
            additionalProperties: true
        },
        data: { 
            elements: CoinbaseAccountSchema
        }
    },
    additionalProperties: true
};

export interface ICoinbaseAddress { 
    data: { 
        address: string;
    };
}

export const CoinbaseAddressSchema: JTDSchemaType<ICoinbaseAddress> = {
    properties: {
        data: { 
            properties: {
                address: { type: "string" }
            },
            additionalProperties: true
        } 
    },
    additionalProperties: true
};

export interface ICoinbaseExchangeRate { 
    data: { 
        amount: string;
        base: string;
    };
}

export const CoinbaseExchangeRateSchema: JTDSchemaType<ICoinbaseExchangeRate> = {
    properties: {
        data: { 
            properties: {
                amount: { type: "string" },
                base: { type: "string" }
            },
            additionalProperties: true
        }
    },
    additionalProperties: true
};