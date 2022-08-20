import mongoose from "mongoose";

export interface IPendingPayment extends mongoose.Document {
    id: string,
    message: string,
    recipientId: string
}

export const PendingPaymentSchema = new mongoose.Schema<IPendingPayment>({
    id: { type: String, required: true, unique: true },
    message: { type: String, required: true, length: 150 },
    recipientId: { type: String, required: true }
});

export const PendingPayment: mongoose.Model<IPendingPayment> = mongoose.model("PendingPayment", PendingPaymentSchema);