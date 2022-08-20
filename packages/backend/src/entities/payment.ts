import mongoose from "mongoose";

export interface IPayment extends mongoose.Document {
    id: string,
    message: string,
    recipientId: string,
    currency: string,
    amount: number,
    exchangeRate: number,
    usdEquivalent: number,
    timestamp: number
}

//TODO: number has rounding errors?

export const PaymentSchema = new mongoose.Schema<IPayment>({
    id: { type: String, required: true, unique: true },
    message: { type: String, required: true, length: 150 },
    recipientId: { type: String, required: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    exchangeRate: { type: Number, required: true },
    usdEquivalent: { type: Number, required: true },
    timestamp: { type: Number, required: true },
});

export const Payment: mongoose.Model<IPayment> = mongoose.model("Payment", PaymentSchema);