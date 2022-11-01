import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface IAuth0TokenResponse {
    access_token: string;
}

export const Auth0TokenResponseSchema: JTDSchemaType<IAuth0TokenResponse> = {
    properties: {
        access_token: { type: "string" }
    },
    additionalProperties: true
};

export interface IAuth0UserResponse {
    email: string;
}

export const Auth0UserResponseSchema: JTDSchemaType<IAuth0UserResponse> = {
    properties: {
        email: { type: "string" }
    },
    additionalProperties: true
};