import mongoose from "mongoose";

export interface ICoinbaseAccount extends Document {
    id: string,
    currency: string,
    color: string,
    icon: string
}

export const CoinbaseAccountScheme = new mongoose.Schema<ICoinbaseAccount>({
    id: { type: String, required: true, unique: true },
    currency: { type: String, required: true },
    color: { type: String, required: true },
    icon: { type: String, required: true },
});

export const CoinbaseAccount: mongoose.Model<ICoinbaseAccount> = mongoose.model("CoinbaseAccount", CoinbaseAccountScheme);