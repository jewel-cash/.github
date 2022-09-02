import mongoose from "mongoose";

export interface IStripeAccount extends Document {
    userId: string;
    stripeId: string;
    onboarded: boolean;
}

export const StripeAccountScheme = new mongoose.Schema<IStripeAccount>({
    userId: { type: String, required: true, unique: true },
    stripeId: { type: String, required: true, unique: true },
    onboarded: { type: Boolean, default: false }
});

export const StripeAccount: mongoose.Model<IStripeAccount> = mongoose.model("StripeAccount", StripeAccountScheme);