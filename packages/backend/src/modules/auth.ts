import { Request } from "express";
import { HttpError } from "../modules/error.js";
import { appCheck, auth } from "./firebase.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiKey, IApiKey } from "../entities/apikey.js";

dotenv.config();

export const expressAuthentication = async (req: Request, securityName: string, scopes: string[]) => {
    const appId = await getAppId[securityName](req);
    const userId = await getUserId[securityName](req);
    return { appId, userId, scopes };
};

interface Handler { 
    [key: string]: (req: Request) => Promise<string>
}

const getAppId: Handler = {
    token: async (req: Request) => {
        try {
            const signatureToken = req.header("Signature");
            if (!signatureToken) { throw new Error("NoSignatureHeader"); }
            const signatureClaim = await appCheck.verifyToken(signatureToken);
            return signatureClaim.appId;
        } catch (err) {
            if (process.env.DEBUG === "true") {
                return "TestAppId";
            }
            throw new HttpError(403, "Forbidden");
        }
    },
    key: async (req: Request) => {
        try {
            const authorizationToken = req.header("Signature");
            if (!authorizationToken) { throw new Error("NoSignatureHeader"); }
            const authorizationClaim = <IApiKey>jwt.verify(authorizationToken, secretKey);
            if (await ApiKey.findOne({ keyId: authorizationClaim.keyId }).exec() == null) { throw new Error("ApiKeyRevoked"); };
            return authorizationClaim.keyId;
        } catch (err) {
            if (process.env.DEBUG === "true") {
                return "TestAppId";
            }
            throw new HttpError(403, "Forbidden");
        }
    }
};

const getUserId: Handler = {
    token: async (req: Request) => {
        try {
            const authorizationToken = req.header("Authorization");
            if (!authorizationToken) { throw new Error("NoAuthorizationHeader"); }
            const authorizationClaim = await auth.verifyIdToken(authorizationToken, true);
            return authorizationClaim.uid;
        } catch (err) {
            if (process.env.DEBUG === "true") {
                return "TestUserId";
            }
            throw new HttpError(401, "Unauthorized");
        }
    },
    key: async (req: Request) => {
        try {
            const authorizationToken = req.header("Authorization");
            if (!authorizationToken) { throw new Error("NoAuthorizationHeader"); }
            const authorizationClaim = <IApiKey>jwt.verify(authorizationToken, secretKey);
            return authorizationClaim.userId;
        } catch (err) {
            if (process.env.DEBUG === "true") {
                return "TestUserId";
            }
            throw new HttpError(401, "Unauthorized");
        }
    }
};

const secretKey = process.env.JWT_KEY ?? "";

export const createApiKey = (payload: IApiKey) => {
    const options: jwt.SignOptions = { 
        algorithm: "PS256",
        expiresIn: "1 year",
        notBefore: "1s",
        issuer: "jewel.cash",
        mutatePayload: true
    };
    
    return jwt.sign(payload, secretKey, options);
};