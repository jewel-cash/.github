import mongoose from "mongoose";

export interface ICoinbaseAccount extends Document {
    coinbaseId: string;
    currency: string;
    color: string;
    icon: string;
    slug: string;
    name: string;
    position: number;
}

export const CoinbaseAccountScheme = new mongoose.Schema<ICoinbaseAccount>({
    coinbaseId: { type: String, required: true, unique: true },
    currency: { type: String, required: true },
    color: { type: String, required: true },
    icon: { type: String, required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    position: { type: Number, required: true }
});

export const CoinbaseAccount: mongoose.Model<ICoinbaseAccount> = mongoose.model("coinbase-accounts", CoinbaseAccountScheme);