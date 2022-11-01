import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface IAccountTrolleyWidgetRequest {
    email: string;
}

export const AccountTrolleyWidgetRequestSchema: JTDSchemaType<IAccountTrolleyWidgetRequest> = {
    properties: {
        email: { type: "string" }
    }
};

export interface IAccountTrolleyWidgetResponse {
    widgetLink: string;
}

export const AccountTrolleyWidgetResponseSchema: JTDSchemaType<IAccountTrolleyWidgetResponse> = {
    properties: {
        widgetLink: { type: "string" }
    }
};