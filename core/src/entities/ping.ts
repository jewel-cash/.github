import { Schema, Model, model } from "mongoose";

export interface IPingResponse {
    message: string;
}

export const PingResponseSchema = new Schema<IPingResponse>({ 
    message: { type: String, required: true }
});

export const PingResponse: Model<IPingResponse> = model("ping", PingResponseSchema);