import { SignJWT, JWTVerifyOptions, jwtVerify, decodeJwt, JWTPayload, JWTHeaderParameters } from "jose";
import { nanoid } from "nanoid";
import { createHash } from "crypto";
import { BigNumber } from "bignumber.js";


const issuer = "jewl.app";

export const createChallenge = async (ip: string, key: string) => {
    const difficulty = new BigNumber(2).pow(240);
    const secretKey = Buffer.from(key);

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

export const solveChallenge = async (challenge: string) => {
    const claim = decodeJwt(challenge);
    const difficulty = new BigNumber(claim.dif as string, 16);

    let iterator = 0;
    let result = difficulty.plus(1);
    do {
        iterator++;
        const preImage = `${challenge}|${iterator}`;
        const hash = createHash("sha256")
            .update(preImage, "utf8")
            .digest("hex");
        result = new BigNumber(hash, 16);
    } while (result.gte(difficulty));
    return `${challenge}|${iterator}`;
};

export const verifyChallenge = async (challenge: string, ip: string, key: string) => {
    const secretKey = Buffer.from(key);
    const originalChallenge = challenge.split("|")[0];
    const options: JWTVerifyOptions = {
        audience: issuer,
        issuer: issuer,
        subject: ip
    };
    const claim = await jwtVerify(originalChallenge, secretKey, options);
    const difficulty = new BigNumber(claim.payload.dif as string, 16);

    const hash = createHash("sha256")
        .update(challenge, "utf-8")
        .digest("hex");

    const result = new BigNumber(hash, 16);

    if (result.gte(difficulty)) { throw new Error("challenge response invalid"); }
};