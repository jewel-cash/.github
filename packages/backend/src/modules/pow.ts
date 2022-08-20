import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { createHash } from "crypto";
import { HttpError } from "./error.js";

dotenv.config();

const secretKey = process.env.JWT_KEY ?? "";

export const createChallenge = () => {
    //TODO: cascading difficulty for the same IP?
    const difficulty = BigInt(2) ** BigInt(255);

    const payload: jwt.JwtPayload = {
        kid: uuid(),
        dif: difficulty.toString()
    };

    const options: jwt.SignOptions = { 
        algorithm: "HS512",
        expiresIn: "30s",
        notBefore: "1s",
        issuer: "jewel.cash"
    };

    return jwt.sign(payload, secretKey, options);
};

export const verifyChallenge = (challenge: string, response: string) => {
    try {
        const claim = <jwt.JwtPayload>jwt.verify(challenge, secretKey);
        const difficulty = BigInt(claim.dif);
    
        const hash = createHash("sha256")
            .update(response, "hex")
            .digest("hex");
    
        const result = BigInt(hash);

        if (result >= difficulty) { throw new Error("InvalidChallengeResponse"); }
    } catch {
        if (process.env.DEBUG === "true") {
            return;
        }
        throw new HttpError(403, "The challenge response could not be verified.");
    }
};