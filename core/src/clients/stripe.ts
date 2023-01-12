import { Client } from "../utility/client.js";

export class StripClient extends Client {
    public constructor(key: string) {
        const staticHeaders = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${key}`,
            "Stripe-Version": "2022-08-01"
        };
        super("https://api.stripe.com", staticHeaders);
    }
}
