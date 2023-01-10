import { Client } from "jewl-core";
import fetch from "node-fetch";

const staticHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `Bearer ${process.env.STRIPE_KEY ?? ""}`,
    "Stripe-Version": "2022-08-01"
};

//TODO: implement
export const client = new Client("https://api.stripe.com", fetch, staticHeaders);
