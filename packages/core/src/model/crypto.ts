import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface ICryptoAddressRequest {
    currency: string;
    link: string;
    name: string;
    message?: string;
    challenge: string;
}

export const CryptoAddressRequestSchema: JTDSchemaType<ICryptoAddressRequest> = {
    properties: {
        currency: { type: "string" },
        link: { type: "string" },
        name: { type: "string" },
        challenge: { type: "string" }
    },
    optionalProperties: {
        message: { type: "string" }
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

export interface ICryptoTokensRequest {
    link: string;
}

export const CryptoTokensRequestSchema: JTDSchemaType<ICryptoTokensRequest> = {
    properties: {
        link: { type: "string" }
    }
};

export interface ICryptoTokenResponse {
    currency: string;
    color: string;
    icon: string;
    slug: string;
    name: string;
}

export const CryptoTokenResponseSchema: JTDSchemaType<ICryptoTokenResponse> = {
    properties: {
        currency: { type: "string" },
        color: { type: "string" },
        icon: { type: "string" },
        slug: { type: "string" },
        name: { type: "string" }
    }
};

export interface ICryptoTokensResponse {
    tokens: Array<ICryptoTokenResponse>;
    title: string;
    description: string;
    image: string;
}

export const CryptoTokensResponseSchema: JTDSchemaType<ICryptoTokensResponse> = {
    properties: {
        tokens: {
            elements: CryptoTokenResponseSchema
        },
        title: { type: "string" },
        description: { type: "string" },
        image: { type: "string" }
    }
};

