import { Request } from "express";
import { HttpError } from "../modules/error.js";
import { appCheck, auth } from "./firebase.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { ApiKey } from "../entities/apikey.js";

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
            const authorizationClaim = <jwt.JwtPayload>jwt.verify(authorizationToken, secretKey);
            if (await ApiKey.findOne({ kid: authorizationClaim.kid }).exec() == null) { throw new Error("ApiKeyRevoked"); }
            return authorizationClaim.kid;
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
            const authorizationClaim = <jwt.JwtPayload>jwt.verify(authorizationToken, secretKey);
            return authorizationClaim.uid;
        } catch (err) {
            if (process.env.DEBUG === "true") {
                return "TestUserId";
            }
            throw new HttpError(401, "Unauthorized");
        }
    }
};

const secretKey = process.env.JWT_KEY ?? "";

export const createApiKey = (userId: string, name: string) => {
    const payload: jwt.JwtPayload = {
        kid: uuid(),
        uid: userId,
        cid: name
    };

    const options: jwt.SignOptions = { 
        algorithm: "HS512",
        expiresIn: "1 year",
        notBefore: "1s",
        issuer: "jewel.cash",
        mutatePayload: true
    };

    const key = jwt.sign(payload, secretKey, options);

    return { payload, key };
};