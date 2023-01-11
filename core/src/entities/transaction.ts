import { Schema, Model } from "mongoose";
import { DateTime, DateTimeSchema } from "../utility/date.js";
import { createModel } from "../utility/mongo.js";
import { PreciseNumber, PreciseNumberSchema } from "../utility/number.js";
import { URLSchema } from "../utility/url.js";

export enum TransactionState {
    paymentPending = 0, // Waiting for stripe payment (not used yet)
    paymentInitiated = 1, // Stripe payment initiated (not used yet)
    paymentConfirmed = 2, // Stripe payment confirmed
    purchaseInitiated = 3, // Order entered in coinbase
    purchaseCompleted = 4, // Order completed in coinbase
    transferInitiated = 5, // Transfer of crypto started
    transferCompleted = 6, // Crypto transactions finallized
    refundPending = 7, // Payment refund pending through stripe
    refundInitiated = 8, // Payment refund initiated through stripe
    refundCompleted = 9, // Payment refund completed through stripe
}

export interface ITransaction extends Document {
    state: TransactionState;
    notBefore: DateTime;
    amount: PreciseNumber;
    percentages: Map<string, PreciseNumber>;
    purchased?: Map<string, PreciseNumber>;
    receipts?: Map<string, URL>;
}

export const TransactionSchema = new Schema<ITransaction>({
    state: { type: Number, enum: TransactionState, required: true },
    notBefore: { ...DateTimeSchema, required: true },
    amount: { ...PreciseNumberSchema, required: true },
    percentages: { type: Map, of: PreciseNumberSchema, required: true },
    purchased: { type: Map, of: PreciseNumberSchema },
    receipts: { type: Map, of: URLSchema }
});

export const Transaction: Model<ITransaction> = createModel(TransactionSchema, "transactions");

export interface IInitiateTransactionRequest {
    amount: string;
}

export const InitiateTransactionRequestSchema = new Schema<IInitiateTransactionRequest>({ 
    amount: { type: String, required: true }
});

export const InitiateTransactionRequest: Model<IInitiateTransactionRequest> = createModel(InitiateTransactionRequestSchema);