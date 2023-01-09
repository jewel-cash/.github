import { decodeJwt } from "jose";
import { BigNumber } from "bignumber.js";

export const solveChallenge = async (challenge: string) => {
    const claim = decodeJwt(challenge);
    const difficulty = new BigNumber(claim.dif as string, 16);
    const encoder = new TextEncoder();

    let iterator = 0;
    let result = difficulty.plus(1);
    do {
        const preImage = encoder.encode(`${challenge}|${iterator}`);
        const hash = await crypto.subtle.digest("SHA-256", preImage);
        const hex = [...new Uint8Array(hash)].map(x => `00${x.toString(16)}`.slice(-2)).join("");
        result = new BigNumber(hex, 16);
        iterator++;
    } while (result.gte(difficulty));
    return `${challenge}|${iterator}`;
};