import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface IAuthKeyResponse {
    id: string;
    name: string;
    expires: number;
}

export const AuthKeyResponseSchema: JTDSchemaType<IAuthKeyResponse> = {
    properties: {
        id: { type: "string" },
        name: { type: "string" },
        expires: { type: "int32" }
    }
};

export interface IAuthKeysResponse {
    keys: Array<IAuthKeyResponse>;
}

export const AuthKeysResponseSchema: JTDSchemaType<IAuthKeysResponse> = {
    properties: {
        keys: { 
            elements: AuthKeyResponseSchema
        }
    }
};

export interface IAuthCreateKeyRequest {
    name: string;
}

export const AuthCreateKeyRequestSchema: JTDSchemaType<IAuthCreateKeyRequest> = {
    properties: {
        name: { type: "string" }
    }
};

export interface IAuthCreateKeyResponse {
    payload: IAuthKeyResponse;
    key: string;
}

export const AuthCreateKeyResponseSchema: JTDSchemaType<IAuthCreateKeyResponse> = {
    properties: {
        payload: AuthKeyResponseSchema,
        key: { type: "string" }
    }
};