import { Client, IRequest, CryptoTokensResponseSchema, ICryptoTokensRequest } from "core";
import { onTokenChanged } from "firebase/app-check";
import { onIdTokenChanged } from "firebase/auth";
import { appCheck, auth } from "./firebase";

const staticHeaders = {
    "Content-Type": "application/json"
};
const client = new Client("http://localhost:4000", staticHeaders);

onTokenChanged(appCheck, (result) => {
    client.updateHeaders({ 
        "Signature": result.token 
    });
});

onIdTokenChanged(auth, async (user) => {
    const token = await user?.getIdToken() ?? "";
    client.updateHeaders({ 
        "Authorization": token
    });
});

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