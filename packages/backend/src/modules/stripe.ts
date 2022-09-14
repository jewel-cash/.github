import dotenv from "dotenv";
import { Client, IRequest } from "core";
import { StripeAccountSchema, StripeAccountLinkSchema } from "../model/stripe.js";

dotenv.config();

const client = new Client("https://api.stripe.com");

export const createStripeAccount = async () => {
    const data = new URLSearchParams({
        type: "custom",
        "capabilities[transfers][requested]": "true"
    });
    const request = addHeadersToRequest({
        endpoint: "/v1/accounts",
        method: "POST",
        body: data.toString()
    });
    return await client.request(request, StripeAccountSchema);
};

export const createStripeLink = async (id: string, refreshUrl: string, returnUrl: string) => {
    const data = new URLSearchParams({
        account: id,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: "account_onboarding"
    });
    const request = addHeadersToRequest({
        endpoint: "/v1/account_links",
        method: "POST",
        body: data.toString()
    });
    const response = await client.request(request, StripeAccountLinkSchema);
    return { 
        url: response.url,
        expires: response.expires_at
    };
};

const stripeKey = process.env.STRIPE_KEY ?? "";
const addHeadersToRequest =  (req: IRequest) => {
    const originalHeaders = req.headers ?? { };
    req.headers = {
        ...originalHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${stripeKey}`,
        "Stripe-Version": "2022-08-01"
    };
    return req;
};
