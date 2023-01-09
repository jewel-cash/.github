import mongoose from "mongoose";
import { BigNumber } from "bignumber.js";
import { BigNumberSchema } from "./types.js";
import { isValidName } from "core";

export interface IPendingTransaction extends mongoose.Document {
    name: string;
    message: string;
    recipientId: string;
}

export const PendingTransactionSchema = new mongoose.Schema<IPendingTransaction>({
    name: { type: String, required: true, validate: isValidName },
    message: { type: String, length: 250 },
    recipientId: { type: String, required: true }
});

export const PendingTransaction: mongoose.Model<IPendingTransaction> = mongoose.model("pending-transactions", PendingTransactionSchema);

export interface ITransaction extends mongoose.Document {
    pendingId: string;
    hash: string;
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

export const TransactionSchema = new mongoose.Schema<ITransaction>({
    pendingId: { type: String, required: true },
    hash: {type: String, required: true, unique: true },
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

export const Transaction: mongoose.Model<ITransaction> = mongoose.model("completed-transactions", TransactionSchema);