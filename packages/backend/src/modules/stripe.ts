import dotenv from "dotenv";

dotenv.config();

//TODO: error handling

export const createStripeAccount = async () => {
    const data = new URLSearchParams({
        type: "custom",
        "capabilities[transfers][requested]": "true"
    });
    const response = await request({
        endpoint: "/v1/accounts",
        method: "POST",
        body: data
    });
    return {
        id: response.id as string
    };
};

export const createStripeLink = async (id: string, refreshUrl: string, returnUrl: string) => {
    const data = new URLSearchParams({
        account: id,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: "account_onboarding",
    });
    const response = await request({
        endpoint: "/v1/account_links",
        method: "POST",
        body: data
    });
    console.log(response);
    return {
        url: response.url as string,
        expires: response.expires_at as number
    };
};

interface IRequest {
    method?: string;
    endpoint: string;
    body?: URLSearchParams;
    headers?: Record<string, string>;
}

const stripeKey = process.env.STRIPE_KEY ?? "";

const request = async (req: IRequest) => {
    const originalHeaders = req.headers ?? { };
    const headers: HeadersInit = {
        ...originalHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
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
