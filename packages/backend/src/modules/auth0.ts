import { Client, IRequest, Auth0TokenResponseSchema, Auth0UserResponseSchema } from "core";
import fetch from "node-fetch";

const auth0Domain = process.env.AUTH0_DOMAIN ?? "";
const apiUrl = "https://jewel-cash.eu.auth0.com/api/v2/";
const authClient = new Client(auth0Domain, fetch, { "content-type": "application/json" });
const authClientId = process.env.AUTH0_CLIENT_ID ?? "";
const authSecret = process.env.AUTH0_CLIENT_SECRET ?? "";
const apiClient = new Client(apiUrl, fetch);

const getAuthToken = async (...scopes: string[]) => {
    const body = {
        client_id: authClientId,
        client_secret: authSecret,
        audience: apiUrl,
        grant_type: "client_credentials",
        scope: scopes.join(" ")
    };
    const request: IRequest = {
        endpoint: "/oauth/token",
        method: "POST",
        body: JSON.stringify(body)
    };
    const response = await authClient.request(request, Auth0TokenResponseSchema);
    return response.access_token;
};

export const getAuthUser = async (userId: string) => {
    const token = await getAuthToken("read:users");
    const request: IRequest = {
        endpoint: `/users/${userId}`,
        headers: { Authorization: `Bearer ${token}` }
    };
    return await apiClient.request(request, Auth0UserResponseSchema);
};