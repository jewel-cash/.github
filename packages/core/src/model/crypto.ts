import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface ICryptoAddressRequest {
    currency: string;
    link: string;
    name: string;
    message: string;
    challenge: string;
    challengeResponse: string;
}

export const CryptoAddressRequestSchema: JTDSchemaType<ICryptoAddressRequest> = {
    properties: {
        currency: { type: "string" },
        link: { type: "string" },
        name: { type: "string" },
        message: { type: "string" },
        challenge: { type: "string" },
        challengeResponse: { type: "string" }
    }
};

export interface ICryptoAddressResponse {
    address: string;
}

export const CryptoAddressResponseScheme: JTDSchemaType<ICryptoAddressResponse> = {
    properties: {
        address: { type: "string" }
    }
};

export interface ICryptoChallengeResponse {
    challenge: string;
}

export const CryptoChallengeResponseSchema: JTDSchemaType<ICryptoChallengeResponse> = {
    properties: {
        challenge: { type: "string" }
    }
};

export interface ICryptoTokenResponse {
    currency: string;
    color: string;
    icon: string;
}

export const CryptoTokenResponseSchema: JTDSchemaType<ICryptoTokenResponse> = {
    properties: {
        currency: { type: "string" },
        color: { type: "string" },
        icon: { type: "string" }
    }
};

export interface ICryptoTokensResponse {
    tokens: Array<ICryptoTokenResponse>;
}

export const IryptoTokensResponseSchema: JTDSchemaType<ICryptoTokensResponse> = {
    properties: {
        tokens: {
            elements: CryptoTokenResponseSchema
        }
    }
};

