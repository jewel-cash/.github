import { JTDSchemaType } from "ajv/dist/jtd";

export interface IAccountLinkResponse {
    link: string;
}

export const AccountLinkResponseSchema: JTDSchemaType<IAccountLinkResponse> = {
    properties: {
        link: { type: "string" }
    }
};

export interface IAccountLinksResponse {
    links: Array<IAccountLinkResponse>;
}

export const AccountLinksResponseSchema: JTDSchemaType<IAccountLinksResponse> = {
    properties: {
        links: { 
            elements: AccountLinkResponseSchema
        }
    }
};

export interface IAccountStripeLinkRequest {
    refresh: string;
    redirect: string;
}

export const AccountStripeLinkRequestScheme: JTDSchemaType<IAccountStripeLinkRequest> = {
    properties: {
        refresh: { type: "string" },
        redirect: { type: "string" }
    }
};

export interface IAccountStripeLinkResponse {
    redirect: string;
    expires: number;
}

export const AccountStripeLinkResponseSchema: JTDSchemaType<IAccountStripeLinkResponse> = {
    properties: {
        redirect: { type: "string" },
        expires: { type: "int32" }
    }
};