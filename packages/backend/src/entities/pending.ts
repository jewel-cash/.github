import mongoose from "mongoose";

export interface IPendingPayment extends mongoose.Document {
    name: string;
    message: string;
    recipientId: string;
}

export const PendingPaymentSchema = new mongoose.Schema<IPendingPayment>({
    name: { type: String, required: true, length: 25 },
    message: { type: String, required: true, length: 150 },
    recipientId: { type: String, required: true }
});

export const PendingPayment: mongoose.Model<IPendingPayment> = mongoose.model("PendingPayment", PendingPaymentSchema);