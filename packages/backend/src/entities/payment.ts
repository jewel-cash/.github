import mongoose from "mongoose";
import { BigNumber } from "bignumber.js";
import { BigNumberSchema } from "./types.js";
import { isValidName } from "core";

export interface IPayment extends mongoose.Document {
    pendingId: string;
    name: string;
    message: string;
    recipientId: string;
    currency: string;
    amount: BigNumber;
    exchangeRate: BigNumber;
    proceeds: BigNumber;
    fee: BigNumber;
    timestamp: number;
    payedOut: boolean;
}

export const PaymentSchema = new mongoose.Schema<IPayment>({
    pendingId: { type: String, required: true },
    name: { type: String, required: true, validate: isValidName },
    message: { type: String, required: true, length: 150 },
    recipientId: { type: String, required: true },
    currency: { type: String, required: true },
    amount: { type: BigNumberSchema, required: true },
    exchangeRate: { type: BigNumberSchema, required: true },
    proceeds: { type: BigNumberSchema, required: true },
    fee: { type: BigNumberSchema, required: true },
    timestamp: { type: Number, required: true },
    payedOut: { type: Boolean, default: false }
});

export const Payment: mongoose.Model<IPayment> = mongoose.model("Payment", PaymentSchema);