import { Request } from "express";
import { HttpError } from "../modules/error.js";
import jwt, { Jwt } from "jsonwebtoken";
import { createVerify } from "crypto";
import { queryToObject } from "core";
import JwksRsa from "jwks-rsa";

export const expressAuthentication = async (req: Request, securityName: string, scopes: string[]) => {
    if (process.env.DEBUG === "true") {
        return { userId: "TestUserId", scopes: [] };
    }

    try {
        const userId = await getUserId[securityName](req);
        return { userId, scopes };
    } catch (error) {
        console.log(error);
        throw new HttpError(401, "Invalid or missing authorization.");
    }
};

const auth0Domain = process.env.AUTH0_DOMAIN ?? "";
const auth0Audience = process.env.AUTH0_AUDIENCE ?? "";
const jwks = JwksRsa({
    jwksUri: `${auth0Domain}.well-known/jwks.json`,
    rateLimit: true
});

interface Handler { 
    [key: string]: (req: Request) => Promise<string>;
}

const getUserId: Handler = {
    token: async (req: Request) => {
        const authorizationToken = req.header("Authorization")?.replace("Bearer ", "");
        if (!authorizationToken) { throw new Error("NoAuthorizationHeader"); }
        const authorizationClaim = jwt.decode(authorizationToken, { complete: true }) as Jwt;
        if (!authorizationClaim) { throw new Error("NoAuthorizationClaim"); }
        const authorizationKey = await jwks.getSigningKey(authorizationClaim.header.kid);
        const pubKey = authorizationKey.getPublicKey();
        const options: jwt.VerifyOptions = {
            audience: auth0Audience,
            issuer: auth0Domain
        };
        jwt.verify(authorizationToken, pubKey, options);
        console.log(authorizationClaim);
        return (<jwt.JwtPayload>authorizationClaim.payload).azp;
    },
    admin: async (req: Request) => {
        const authorizationToken = req.header("Authorization")?.replace("Bearer ", "");
        if (!authorizationToken) { throw new Error("NoAuthorizationHeader"); }
        const authorizationClaim = jwt.decode(authorizationToken) as jwt.JwtPayload;
        const roles = authorizationClaim.permissions as Array<string>;
        const hasAdminRole = roles.includes("admin");
        if (!hasAdminRole) { throw new Error("InsufficientPermissions"); }
        return await getUserId["token"](req);
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