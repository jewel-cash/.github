import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const ApiKeySchema = new mongoose.Schema<jwt.JwtPayload>({
    kid: { type: String, required: true, unique: true },
    uid: { type: String, required: true },
    cid: { type: String, required: true, length: 25, unique: true },
    iss: { type: String, required: true },
    nbf: { type: String, required: true },
    exp: { type: String, required: true }
});

export const ApiKey: mongoose.Model<jwt.JwtPayload> = mongoose.model("ApiKey", ApiKeySchema);