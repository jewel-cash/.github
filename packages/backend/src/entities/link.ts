import mongoose from "mongoose";
import { isValidName } from "core";

export interface IUserLink extends Document {
    userId: string;
    link: string;
}

export const UserLinkScheme = new mongoose.Schema<IUserLink>({
    userId: { type: String, required: true },
    link: { type: String, unique: true, validate: isValidName }
});

export const UserLink: mongoose.Model<IUserLink> = mongoose.model("Link", UserLinkScheme);