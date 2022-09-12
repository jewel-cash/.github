import { JTDSchemaType } from "core"; 

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