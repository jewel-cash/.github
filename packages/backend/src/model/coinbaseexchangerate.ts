import { JTDSchemaType } from "core"; 

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