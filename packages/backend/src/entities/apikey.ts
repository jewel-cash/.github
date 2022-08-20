import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export interface IApiKey extends mongoose.Document, jwt.JwtPayload {

}

export const ApiKeySchema = new mongoose.Schema<IApiKey>({
    kid: { type: String, required: true, unique: true },
    uid: { type: String, required: true },
    cid: { type: String, required: true, length: 25, unique: true },
    iss: { type: String, required: true },
    nbf: { type: String, required: true },
    exp: { type: String, required: true }
});

export const ApiKey: mongoose.Model<IApiKey> = mongoose.model("ApiKey", ApiKeySchema);