import { Client, StripeAccountSchema, StripeAccountLinkSchema } from "core";
import fetch from "node-fetch";

const staticHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `Bearer ${process.env.STRIPE_KEY ?? ""}`,
    "Stripe-Version": "2022-08-01"
};
const client = new Client("https://api.stripe.com", fetch, staticHeaders);

export const createStripeAccount = async () => {
    const data = new URLSearchParams({
        type: "custom",
        "capabilities[transfers][requested]": "true"
    });
    const request = {
        endpoint: "/v1/accounts",
        method: "POST",
        body: data.toString()
    };
    return await client.request(request, StripeAccountSchema);
};

export const createStripeLink = async (id: string, refreshUrl: string, returnUrl: string) => {
    const data = new URLSearchParams({
        account: id,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: "account_onboarding"
    });
    const request = {
        endpoint: "/v1/account_links",
        method: "POST",
        body: data.toString()
    };
    const response = await client.request(request, StripeAccountLinkSchema);
    return { 
        url: response.url,
        expires: response.expires_at
    };
};