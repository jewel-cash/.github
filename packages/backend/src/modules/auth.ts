import { Request } from "express";
import { HttpError } from "../modules/error.js";
import { appCheck, auth } from "./firebase.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { ApiKey } from "../entities/apikey.js";
import { createVerify, timingSafeEqual } from "crypto";

dotenv.config();

export const expressAuthentication = async (req: Request, securityName: string, scopes: string[]) => {
    if (process.env.DEBUG === "true") {
        return { appId: "TestAppId", userId: "TestUserId", scopes: [] };
    }

    let appId = "";
    try {
        appId = await getAppId[securityName](req);
    } catch {
        throw new HttpError(403, "Signature header is invalid or missing.");
    }
    
    let userId = "";
    try {
        userId = await getUserId[securityName](req);
    } catch {
        throw new HttpError(401, "Authorization header is invalid or missing.");
    }
   
    return { appId, userId, scopes };
};

interface Handler { 
    [key: string]: (req: Request) => Promise<string>;
}

const getAppId: Handler = {
    token: async (req: Request) => {
        const signatureToken = req.header("Signature");
        if (!signatureToken) { throw new Error("NoSignatureHeader"); }
        const signatureClaim = await appCheck.verifyToken(signatureToken);
        return signatureClaim.appId;
    },
    key: async (req: Request) => {
        const signatureToken = req.header("Signature");
        if (!signatureToken) { throw new Error("NoSignatureHeader"); }
        const signatureClaim = jwt.verify(signatureToken, secretKey) as jwt.JwtPayload;
        if (await ApiKey.findOne({ kid: signatureClaim.kid }).exec() == null) { throw new Error("ApiKeyRevoked"); }
        return signatureClaim.kid;
    },
    admin: async (req: Request) => {
        const signatureToken = req.header("Signature");
        if (!signatureToken) { throw new Error("NoSignatureHeader"); }
        const signatureBuffer = Buffer.from(signatureToken, "utf8");
        const checkBuffer = Buffer.from(process.env.ADMIN_SIGNATURE ?? "", "utf8");
        if (!timingSafeEqual(signatureBuffer, checkBuffer)) { throw new Error("InvalidSignatureToken"); }
        return "Admin";
    },
    coinbase: async (req: Request) => {
        const signature = req.header("CB-SIGNATURE") ?? "";
        const rawBody = req.body ?? "";
        const pubKey = process.env.COINBASE_PUB_KEY ?? "";
        const verify = createVerify("RSA-SHA256")
            .update(rawBody)
            .verify(pubKey, signature, "base64");

        //TODO: replay attack?
        //TODO: check timestamp

        if (!verify) { throw new Error("SignatureDoesNotVerify"); }
        return "Coinbase";
    },
    stripe: async (_req: Request) => {
        //TODO: 
        return "Stripe";
    }
};

const getUserId: Handler = {
    token: async (req: Request) => {
        const authorizationToken = req.header("Authorization");
        if (!authorizationToken) { throw new Error("NoAuthorizationHeader"); }
        const authorizationClaim = await auth.verifyIdToken(authorizationToken, true);
        return authorizationClaim.uid;
    },
    key: async (req: Request) => {
        const authorizationToken = req.header("Authorization");
        if (!authorizationToken) { throw new Error("NoAuthorizationHeader"); }
        const authorizationClaim = jwt.verify(authorizationToken, secretKey) as jwt.JwtPayload;
        return authorizationClaim.uid;
    },
    admin: async (req: Request) => {
        const authorizationToken = req.header("Authorization");
        if (!authorizationToken) { throw new Error("NoAuthorizationHeader"); }
        const authorizationBuffer = Buffer.from(authorizationToken, "utf8");
        const checkBuffer = Buffer.from(process.env.ADMIN_KEY ?? "", "utf8");
        if (!timingSafeEqual(authorizationBuffer, checkBuffer)) { throw new Error("InvalidAuthorizationToken"); }
        return "Admin";
    },
    coinbase: async (req: Request) => {
        if (req.ip !== "54.175.255.192/27") {  throw new Error("WrongSourceIp"); }
        return "Coinbase";
    },
    stripe: async (_req: Request) => {
        //TODO: 
        return "Stripe";
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