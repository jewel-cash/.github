import { JTDSchemaType } from "ajv/dist/jtd.js";

export interface IPingResponse {
    message: string;
}

export const PingResponseSchema: JTDSchemaType<IPingResponse> = {
    properties: {
        message: { type: "string" }
    }
};