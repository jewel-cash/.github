import { JTDSchemaType } from "core"; 

export interface ICoinbaseAddress { 
    data: { 
        address: string;
    };
}

export const CoinbaseAddressSchema: JTDSchemaType<ICoinbaseAddress> = {
    properties: {
        data: { 
            properties: {
                address: { type: "string" },
            },
            additionalProperties: true
        }, 
    },
    additionalProperties: true
};