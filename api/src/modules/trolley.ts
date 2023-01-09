import { now } from "core";
import { createHmac } from "crypto";

const trolleyKey = process.env.TROLLEY_KEY ?? "";
const trolleySecret = process.env.TROLLEY_SECRET ?? "";

export const createWidgetLink = (userId: string, email: string) => {
    const url = new URL("https://widget.trolley.com");
    const query = new URLSearchParams({
        ts: `${now()}`,
        key: trolleyKey,
        email: email,
        refid: userId,
        hideEmail: "true"
    }).toString().replace(/\+/g, "%20");

    const signature = createHmac("sha256", trolleySecret)
        .update(query)
        .digest("hex");

    url.search =  query + "&sign=" + signature;
    return url.toString();
};