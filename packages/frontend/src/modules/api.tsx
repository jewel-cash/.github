import { Client, IRequest, CryptoTokensResponseSchema, ICryptoTokensRequest, DashboardOverviewResponseSchema, IAccountTrolleyWidgetRequest, AccountTrolleyWidgetResponseSchema, CryptoChallengeResponseSchema, ICryptoAddressRequest, CryptoAddressResponseScheme, DashboardTransactionsResponseSchema } from "core";
import { solveChallenge } from "./pow";

const baseUrl = process.env.REACT_APP_SERVER_URL ?? "";

const staticHeaders = {
    "Content-Type": "application/json"
};
const fetch = window.fetch.bind(window);
const client = new Client(baseUrl, fetch, staticHeaders);

export const getTokens = async (link: string) => {
    const body: ICryptoTokensRequest = {
        link
    };
    const request: IRequest = {
        endpoint: "/v1/crypto/tokens",
        method: "POST",
        body: JSON.stringify(body)
    };
    return await client.request(request, CryptoTokensResponseSchema);
};

export const getDashboardOverview = async (auth: string) => {
    const request: IRequest = {
        endpoint: "/v1/dashboard/overview",
        headers: { "Authorization": `Bearer ${auth}` }
    };
    return await client.request(request, DashboardOverviewResponseSchema);
};

export const getTrolleyWidget = async (auth: string, email: string) => {
    const body: IAccountTrolleyWidgetRequest = {
        email
    };
    const request: IRequest = {
        endpoint: "/v1/account/trolley",
        headers: { "Authorization": `Bearer ${auth}` },
        method: "POST",
        body: JSON.stringify(body)
    };
    return await client.request(request, AccountTrolleyWidgetResponseSchema);
};

export const createCryptoAddress = async (link: string, currency: string, name: string, message?: string) => {
    const challengeRequest: IRequest = {
        endpoint: "/v1/crypto/challenge"
    };
    const challengeResponse = await client.request(challengeRequest, CryptoChallengeResponseSchema);
    const challengeAnswer = await solveChallenge(challengeResponse.challenge);

    const body: ICryptoAddressRequest = {
        link,
        currency,
        name,
        message,
        challenge: challengeAnswer
    };
    const addressRequest: IRequest = {
        endpoint: "/v1/crypto/address",
        method: "POST",
        body: JSON.stringify(body)
    };
    return await client.request(addressRequest, CryptoAddressResponseScheme);
};

export const getDashboardTransactions = async (auth: string) => {
    const request: IRequest = {
        endpoint: "/v1/dashboard/trasactions",
        headers: { "Authorization": `Bearer ${auth}` }
    };
    return await client.request(request, DashboardTransactionsResponseSchema);
};