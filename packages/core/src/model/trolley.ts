import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface IAccountTrolleyWidgetResponse {
    widgetLink: string;
}

export const AccountTrolleyWidgetResponseSchema: JTDSchemaType<IAccountTrolleyWidgetResponse> = {
    properties: {
        widgetLink: { type: "string" }
    }
};