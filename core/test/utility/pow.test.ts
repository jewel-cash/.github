import { createChallenge, solveChallenge, verifyChallenge } from "../../src/utility/pow";
import {jest} from "@jest/globals";

const mockSecretKey = "";
const validIp = "abc";
const invalidIp = "abcd";
const challenge = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJraWQiOiJ2WXc2MUw0Y3JtSElVNzBWU2swVzciLCJkaWYiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwiaWF0IjoxNjczMjYzODgwLCJpc3MiOiJqZXdsLmFwcCIsImF1ZCI6Impld2wuYXBwIiwic3ViIjoiYWJjIiwiZXhwIjoxNjczMjYzOTEwLCJuYmYiOjE2NzMyNjM4ODF9.qYEdN4Gpw2mjge9_bO_lESLz-C_ifdiTB-ixGogkGCE1w61m-8_CHNS67LnTTwItsudF0YzWKtqaWmhzC-OLcQ";
const invalidChallenge = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJraWQiOiI3VFVSY251aU1LT3VNNGNrNnJELXAiLCJkaWYiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwiaWF0IjoxNjczMjYzODgwLCJpc3MiOiJqZXdsLmFwcCIsImF1ZCI6Impld2wuYXBwIiwic3ViIjoiYWJjIiwiZXhwIjoxNjczMjYzOTEwLCJuYmYiOjE2NzMyNjM4ODF9.Z844CaQyv9LNn-Yi-a09m-MCZSWsVBrBojnqohO5CqjUgS_CSgt0XHlupHZhWXMyOiOjOdODl39V41k-6OSzoA";
const challengeResponse = "73";
const invalidChallengeResponse = "18";

const validTime = 1673263890000;
const tooEarly = 1673263790000;
const tooLate = 1673263990000;

it("PoW create challenge should be valid jwt", async () => {
    const challenge = await createChallenge(validIp, mockSecretKey);
    const parts = challenge.split(".");
    expect(parts.length).toStrictEqual(3);
});

it("PoW solve challenge should solve a challenge with the correct response", async () => {
    const response = await solveChallenge(challenge);
    const parts = response.split("|");
    expect(parts[1]).toStrictEqual(challengeResponse);
});

it("PoW verify challenge should verify a valid challenge", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(validTime);
    const response = `${challenge}|${challengeResponse}`;
    const method = async () => await verifyChallenge(response, validIp, mockSecretKey);
    await expect(method()).resolves.not.toThrowError();
    jest.useRealTimers();
});

it("PoW verify challenge should not verify an invalid challenge", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(validTime);
    const response = `${challenge}|${invalidChallengeResponse}`;
    const method = async () => await verifyChallenge(response, validIp, mockSecretKey);
    await expect(method()).rejects.toThrowError(new Error("challenge response invalid"));
    jest.useRealTimers();
});

it("PoW verify challenge should not verify a challenge from an invalid subject", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(validTime);
    const response = `${challenge}|${challengeResponse}`;
    const method = async () => await verifyChallenge(response, invalidIp, mockSecretKey);
    await expect(method()).rejects.toThrowError(new Error("unexpected \"sub\" claim value"));
    jest.useRealTimers();
});

it("PoW verify challenge should not verify a faked challenge", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(tooEarly);
    const response = `${challenge}|${challengeResponse}`;
    const method = async () => await verifyChallenge(response, validIp, mockSecretKey);
    await expect(method()).rejects.toThrowError(new Error("\"nbf\" claim timestamp check failed"));
    jest.useRealTimers();
});

it("PoW verify challenge should not verify an expired challenge", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(tooLate);
    const response = `${challenge}|${challengeResponse}`;
    const method = async () => await verifyChallenge(response, validIp, mockSecretKey);
    await expect(method()).rejects.toThrowError(new Error("\"exp\" claim timestamp check failed"));
    jest.useRealTimers();
});

it("PoW verify challenge should not verify with a spoofed challenge", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(validTime);
    const response = `${invalidChallenge}|${invalidChallengeResponse}`;
    const method = async () => await verifyChallenge(response, validIp, mockSecretKey);
    await expect(method()).rejects.toThrowError(new Error("signature verification failed"));
    jest.useRealTimers();
});