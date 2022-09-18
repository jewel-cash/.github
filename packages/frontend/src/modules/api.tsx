import { Client, IRequest, CryptoTokensResponseSchema, ICryptoTokensRequest, DashboardOverviewResponseSchema } from "core";

const staticHeaders = {
    "Content-Type": "application/json"
};
const client = new Client("http://localhost:4000", staticHeaders);

export const getTokens = async (link: string) => {
    const body: ICryptoTokensRequest = {
        link
    };
    const request: IRequest = {
        endpoint: "/v1/crypto/tokens",
        method: "POST",
        body: JSON.stringify(body)
    };
    const response = await client.request(request, CryptoTokensResponseSchema);
    return response.tokens;
};

export const getDashboardOverview = async (auth: string) => {
    const request: IRequest = {
        endpoint: "/v1/dashboard/overview",
        headers: { "Authorization": auth }
    };
    const response = await client.request(request, DashboardOverviewResponseSchema);
    return response;
};