import { Schema, Model } from "mongoose";
import { createModel } from "../utility/mongo.js";
import { PreciseNumber, PreciseNumberSchema } from "../utility/number.js";

export interface ITokenResponse {
    coinbaseId: string;
}

export const TokenResponseSchema = new Schema<ITokenResponse>({
    coinbaseId: { type: String, required: true }
});

export interface ITokensResponse {
    tokens: Array<ITokenResponse>;
    suggestedSplit: Map<string, PreciseNumber>;
}

export const TokensResponseSchema = new Schema<ITokensResponse>({
    tokens: { type: [TokenResponseSchema], default: undefined, required: true },
    suggestedSplit: { type: Map, of: PreciseNumberSchema, required: true }
});

export const TokensResponse: Model<ITokensResponse> = createModel(TokensResponseSchema);


