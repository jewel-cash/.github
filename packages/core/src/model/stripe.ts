import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface IStripeAccount { 
    id: string;
}

export const StripeAccountSchema: JTDSchemaType<IStripeAccount> = {
    properties: {
        id: { type: "string" }
    },
    additionalProperties: true
};

export interface IStripeAccountLink { 
    url: string;
    expires_at: number;
}

export const StripeAccountLinkSchema: JTDSchemaType<IStripeAccountLink> = {
    properties: {
        url: { type: "string" },
        expires_at: { type: "int32" }
    },
    additionalProperties: true
};