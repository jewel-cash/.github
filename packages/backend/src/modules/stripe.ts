import dotenv from "dotenv";

dotenv.config();

export const createStripeAccount = async () => {
    const data = JSON.stringify({
        type: "express"
    })
    const response = await request({
        endpoint: "/v1/accounts",
        method: "POST",
        body: data
    });
    return response.id as string;
};

export const createStripeLink = async (id: string, refreshUrl: string, returnUrl: string) => {
    const data = JSON.stringify({
        account: id,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: "account_onboarding",
    })
    const response = await request({
        endpoint: "/v1/account_links",
        method: "POST",
        body: data
    });
    return {
        url: response.url as string,
        expires: response.expires_at as number
    };
};

interface IRequest {
    method?: string;
    endpoint: string;
    body?: string;
    headers?: Record<string, string>;
}

const stripeKey = process.env.STRIPE_KEY ?? "";

const request = async (req: IRequest) => {
    const originalHeaders = req.headers ?? { };
    const headers: HeadersInit = {
        ...originalHeaders,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${stripeKey}`,
        "Stripe-Version": "2022-08-01"
    };

    const url: RequestInfo = "https://api.stripe.com" + req.endpoint;
    const request: RequestInit = {
        headers,
        method: req.method,
        body: req.body
    };
    const res = await fetch(url, request);
    return await res.json();
};
