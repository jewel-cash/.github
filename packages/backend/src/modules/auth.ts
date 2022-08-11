import { Request } from "express";
import { HttpError } from "../modules/error.js";
import { appCheck, auth } from "./firebase.js";
import jwt from "jsonwebtoken";

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
            if (!signatureToken) { throw new Error("NoAppCheckToken"); }
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
        return req.toString();
    }
};

const getUserId: Handler = {
    token: async (req: Request) => {
        try {
            const authorizationToken = req.header("Authorization");
            if (!authorizationToken) { throw new Error("NoAppCheckToken"); }
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
        return req.toString();
    }
};

export interface IKeyPayload {
    keyId: string
    userId: string
    name: string
}

export const createApiKey = (payload: IKeyPayload) => {
    const options: jwt.SignOptions = { 
        algorithm: "PS256",
        expiresIn: "1 year",
        notBefore: "1s",
        mutatePayload: true
    };

    const secretKey = process.env.JWT_KEY ?? "";
    return jwt.sign(payload, secretKey, options);
};