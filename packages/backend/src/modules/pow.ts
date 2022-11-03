import { SignJWT, JWTVerifyOptions, jwtVerify, JWTPayload, JWTHeaderParameters } from "jose";
import { nanoid } from "nanoid";
import { createHash } from "crypto";
import { HttpError } from "./error.js";
import { BigNumber } from "bignumber.js";

const secretKey = Buffer.from(process.env.JWT_KEY ?? "");
const issuer = "jewel.cash";

export const createChallenge = async (ip: string) => {
    const difficulty = new BigNumber(2).pow(240);

    const payload: JWTPayload = {
        kid: nanoid(), 
        dif: difficulty.toString(16)
    };

    const header: JWTHeaderParameters = {
        alg: "HS512",
        typ: "JWT"
    };

    return await new SignJWT(payload)
        .setProtectedHeader(header)
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(issuer)
        .setSubject(ip)
        .setExpirationTime("30s")
        .setNotBefore("1s")
        .sign(secretKey);
};

export const verifyChallenge = async (challenge: string, ip: string) => {
    try {
        const originalChallenge = challenge.split("|")[0];
        const options: JWTVerifyOptions = {
            audience: issuer,
            issuer: issuer,
            subject: ip
        };
        const claim = await jwtVerify(originalChallenge, secretKey, options);
        const difficulty = new BigNumber(claim.payload.dif as string);
    
        const hash = createHash("sha256")
            .update(challenge, "hex")
            .digest("hex");
    
        const result = new BigNumber(hash, 16);

        if (result.gte(difficulty)) { throw new Error("InvalidChallengeResponse"); }
    } catch {
        if (process.env.DEBUG === "true") {
            return;
        }
        throw new HttpError(403, "The challenge response could not be verified.");
    }
};