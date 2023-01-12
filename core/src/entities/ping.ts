import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

export interface IPingResponse {
    message: string;
}

export const PingResponseSchema = new Schema<IPingResponse>({
    message: { type: String,
        required: true }
});

export const PingResponse = createModel<IPingResponse>(PingResponseSchema);
