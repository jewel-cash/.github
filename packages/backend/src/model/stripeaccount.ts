import { JTDSchemaType } from "core"; 

export interface IStripeAccount { 
    id: string;
}

export const StripeAccountSchema: JTDSchemaType<IStripeAccount> = {
    properties: {
        id: { type: "string" }
    },
    additionalProperties: true
};