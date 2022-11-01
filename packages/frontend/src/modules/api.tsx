import { Client, IRequest, CryptoTokensResponseSchema, ICryptoTokensRequest, DashboardOverviewResponseSchema, AccountTrolleyWidgetResponseSchema } from "core";

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

export const getTrolleyWidget = async (auth: string) => {
    const request: IRequest = {
        endpoint: "/v1/account/trolley",
        headers: { "Authorization": `Bearer ${auth}` }
    };
    return await client.request(request, AccountTrolleyWidgetResponseSchema);
};