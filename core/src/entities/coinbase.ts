import { Schema, model, Model } from "mongoose";
import { PreciseNumber, PreciseNumberSchema } from "../utility/number.js";

export interface ICoinbaseExchangeRate { 
    data: ICoinbaseExchangeRateData;
}

export interface ICoinbaseExchangeRateData {
    amount: PreciseNumber;
    base: string;
}

export const CoinbaseExchangeRateDataSchema = new Schema<ICoinbaseExchangeRateData>({
    amount: { type: PreciseNumberSchema, required: true },
    base: { type: String, required: true }
});

export const CoinbaseExchangeRateSchema = new Schema<ICoinbaseExchangeRate>({
    data: { type: CoinbaseExchangeRateDataSchema, required: true }
});

export const CoinbaseExchangeRate: Model<ICoinbaseExchangeRate> = model("coinbase-exchange-rate", CoinbaseExchangeRateSchema);