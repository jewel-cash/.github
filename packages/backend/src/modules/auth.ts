import { Request } from "express";
import { HttpError } from "../modules/error.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { ApiKey } from "../entities/apikey.js";
import { createVerify, timingSafeEqual } from "crypto";
import { queryToObject } from "core";

export const expressAuthentication = async (req: Request, securityName: string, scopes: string[]) => {
    if (process.env.DEBUG === "true") {
        return { userId: "TestUserId", scopes: [] };
    }

    try {
        const userId = await getUserId[securityName](req);
        return { userId, scopes };
    } catch {
        throw new HttpError(401, "Invalid or missing authorization.");
    }
};

interface Handler { 
    [key: string]: (req: Request) => Promise<string>;
}

const getUserId: Handler = {
    token: async (req: Request) => {
        const authorizationToken = req.header("Authorization");
        if (!authorizationToken) { throw new Error("NoAuthorizationHeader"); }
        const tokenSecret = process.env.AUTH0_SECRET ?? "";
        const authorizationClaim = jwt.verify(authorizationToken, tokenSecret) as jwt.JwtPayload;
        return authorizationClaim.uid;
    },
    key: async (req: Request) => {
        const authorizationToken = req.header("Authorization");
        if (!authorizationToken) { throw new Error("NoAuthorizationHeader"); }
        const authorizationClaim = jwt.verify(authorizationToken, jwtSecret) as jwt.JwtPayload;
        if (await ApiKey.findOne({ kid: authorizationClaim.kid }).exec() == null) { throw new Error("ApiKeyRevoked"); }
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
        //TODO: replay attack?
        const signature = req.header("CB-SIGNATURE") ?? "";
        const rawBody = req.body ?? "";
        const pubKey = process.env.COINBASE_PUB_KEY ?? "";
        const verify = createVerify("RSA-SHA256")
            .update(rawBody)
            .verify(pubKey, signature, "base64");

        if (!verify) { throw new Error("SignatureDoesNotVerify"); }
        return "Coinbase";
    },
    stripe: async (req: Request) => {
        const signatureHeader = req.header("Stripe-Signature") ?? "";
        const signatureClaim = queryToObject(signatureHeader);
        const timestamp = parseInt(signatureClaim.t);
        if (!timestampIsNow(timestamp)) { throw new Error("RequestTooOldOrNew"); }

        const signature = signatureClaim.v1;
        const rawBody = req.body ?? "";
        const preimage = `${timestamp}.${rawBody}`;
        const secret = process.env.STRIPE_SECRET ?? "";

        const verify = createVerify("SHA256")
            .update(preimage)
            .verify(secret, signature, "hex");

        if (!verify) { throw new Error("SignatureDoesNotVerify"); }

        return "Stripe";
    }
};

const timestampIsNow = (timestamp: number, tolerance = 300) => {
    const now = new Date().toUnix();
    if (timestamp < now - tolerance) { return false; }
    if (timestamp > now + tolerance) { return false; }
    return true;
};

const jwtSecret = process.env.JWT_SECRET ?? "";

export const createApiKey = (userId: string, name: string) => {
    const payload: jwt.JwtPayload = {
        kid: nanoid(),
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

    const key = jwt.sign(payload, jwtSecret, options);

    return { payload, key };
};
