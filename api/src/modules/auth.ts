import type { Request } from "express";
import { HttpError } from "./error.js";
import { createVerify } from "crypto";
import type { JWTVerifyOptions } from "jose";
import { createRemoteJWKSet, jwtVerify, decodeJwt } from "jose";
import { DateTime, queryToObject } from "jewl-core";

const auth0Domain = process.env.AUTH0_DOMAIN ?? "";
const auth0Audience = process.env.AUTH0_AUDIENCE ?? "";
const jwksUrl = new URL(`${auth0Domain}.well-known/jwks.json`);
const jwks = createRemoteJWKSet(jwksUrl);

const getUserId: Record<string, (req: Request) => Promise<string>> = {
    token: async (req: Request): Promise<string> => {
        const authorizationToken = req.header("Authorization")?.replace("Bearer ", "");
        if (authorizationToken == null) {
            throw new Error("no authorization header");
        }
        const options: JWTVerifyOptions = {
            audience: auth0Audience,
            issuer: auth0Domain
        };
        const authorizationClaim = await jwtVerify(authorizationToken, jwks, options);
        return authorizationClaim.payload.sub ?? "";
    },
    admin: async (req: Request): Promise<string> => {
        const authorizationToken = req.header("Authorization")?.replace("Bearer ", "");
        if (authorizationToken == null) {
            throw new Error("no authorization header");
        }
        const authorizationClaim = decodeJwt(authorizationToken);
        const roles = authorizationClaim.permissions as Array<string>;
        const hasAdminRole = roles.includes("admin");
        if (!hasAdminRole) {
            throw new Error("user has insufficient permissions");
        }
        return getUserId.token(req);
    },
    coinbase: async (req: Request): Promise<string> => {
        const signature = req.header("CB-SIGNATURE") ?? "";
        const rawBody = req.rawBody.toString();
        const pubKey = process.env.COINBASE_PUB_KEY ?? "";
        const verify = createVerify("rsa-sha256")
            .update(rawBody)
            .verify(pubKey, signature, "base64");

        if (!verify) {
            throw new Error("coinbase signature does not verify");
        }
        return Promise.resolve("Coinbase");
    },
    stripe: async (req: Request): Promise<string> => {
        const signatureHeader = req.header("Stripe-Signature") ?? "";
        const signatureClaim = queryToObject(signatureHeader);
        const timestamp = new DateTime(signatureClaim.t);
        if (!timestamp.isNow()) {
            throw new Error("request has expired");
        }

        const signature = signatureClaim.v1;
        const preimage = `${timestamp}.${req.rawBody.toString()}`;
        const secret = process.env.STRIPE_SECRET ?? "";

        const verify = createVerify("SHA256")
            .update(preimage)
            .verify(secret, signature, "hex");

        if (!verify) {
            throw new Error("stripe signature is invalid");
        }
        return Promise.resolve("Stripe");
    }
};

interface Authentication {
    userId: string;
    scopes: Array<string>;

}
export const expressAuthentication = async (req: Request, securityName: string, scopes: Array<string>): Promise<Authentication> => {
    try {
        const userId = await getUserId[securityName](req);
        return { userId, scopes };
    } catch {
        if (process.env.DEBUG === "true") {
            return { userId: "TestUserId", scopes: [] };
        }
        throw new HttpError(401, "Invalid or missing authorization.");
    }
};
