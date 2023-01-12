import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

export interface ICoinbaseProduct {
    id: string;
    base_currency: string;
    quote_currency: string;
}

export const CoinbaseProductSchema = new Schema<ICoinbaseProduct>({
    id: { type: String, required: true },
    base_currency: { type: String, required: true },
    quote_currency: { type: String, required: true }
});

export interface ICoinbaseProducts {
    list: Array<ICoinbaseProduct>;
}

export const CoinbaseProductsSchema = new Schema<ICoinbaseProducts>({
    list: { type: [CoinbaseProductSchema],
        default: undefined,
        required: true }
});

export const CoinbaseProducts = createModel<ICoinbaseProducts>(CoinbaseProductsSchema);
