import mongoose from "mongoose";
import { isValidName } from "core";

export interface IUserLink extends Document {
    userId: string;
    slug: string;
    title: string;
    description: string;
    image: string;
}

export const UserLinkScheme = new mongoose.Schema<IUserLink>({
    userId: { type: String, required: true },
    slug: { type: String, unique: true, validate: isValidName },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }
});

export const UserLink: mongoose.Model<IUserLink> = mongoose.model("account-links", UserLinkScheme);