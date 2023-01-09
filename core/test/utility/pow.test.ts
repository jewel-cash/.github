import { createChallenge, solveChallenge, verifyChallenge } from "../../src/utility/pow";
import {jest} from "@jest/globals";

const validIp = "abc";
const invalidIp = "abcd";
const challenge = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJraWQiOiJxS0pVRmxfT0xqeEVzS2xBQkNHZ1IiLCJkaWYiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwiaWF0IjoxNjczMjYzODgwLCJpc3MiOiJqZXdlbC5hcHAiLCJhdWQiOiJqZXdlbC5hcHAiLCJzdWIiOiJhYmMiLCJleHAiOjE2NzMyNjM5MTAsIm5iZiI6MTY3MzI2Mzg4MX0.r7mww9fm1lj9O7Y9WgQs8mbQhiJru--G2cCafX1q8BGzbdfyr8XbTEFY9BTFFkWGDzyPXxBPtcGbap-ZU_Sl7g";
const challengeResponse = "73";
const invalidChallengeResponse = "75";

const validTime = 1673263890000;
const tooEarly = 1673263790000;
const tooLate = 1673263990000;

it("PoW create challenge should be valid jwt", async () => {
    const challenge = await createChallenge(validIp);
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
    const method = async () => await verifyChallenge(response, validIp);
    await expect(method()).resolves.not.toThrowError();
    jest.useRealTimers();
});

it("PoW verify challenge should not verify an invalid challenge", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(validTime);
    const response = `${challenge}|${invalidChallengeResponse}`;
    const method = async () => await verifyChallenge(response, validIp);
    await expect(method()).rejects.toThrowError(new Error("challenge response invalid"));
    jest.useRealTimers();
});

it("PoW verify challenge should not verify a challenge from an invalid subject", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(validTime);
    const response = `${challenge}|${challengeResponse}`;
    const method = async () => await verifyChallenge(response, invalidIp);
    await expect(method()).rejects.toThrowError(new Error("unexpected \"sub\" claim value"));
    jest.useRealTimers();
});

it("PoW verify challenge should not verify a faked challenge", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(tooEarly);
    const response = `${challenge}|${challengeResponse}`;
    const method = async () => await verifyChallenge(response, validIp);
    await expect(method()).rejects.toThrowError(new Error("\"nbf\" claim timestamp check failed"));
    jest.useRealTimers();
});

it("PoW verify challenge should not verify an expired challenge", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(tooLate);
    const response = `${challenge}|${challengeResponse}`;
    const method = async () => await verifyChallenge(response, validIp);
    await expect(method()).rejects.toThrowError(new Error("\"exp\" claim timestamp check failed"));
    jest.useRealTimers();
});