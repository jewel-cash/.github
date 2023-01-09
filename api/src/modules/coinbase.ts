import { BigNumber } from "bignumber.js";
import { createHmac } from "crypto";
import { Client, IRequest, CoinbaseExchangeRateSchema } from "jewl-core";
import fetch from "node-fetch";

const staticHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "CB-ACCESS-KEY": process.env.COINBASE_KEY ?? "",
    "CB-VERSION": "2022-03-03"
};
const client = new Client("https://api.coinbase.com", fetch, staticHeaders);

export const getExchangeRate = async (currency: string, timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const request = addHeadersToRequest({
        endpoint: `/v2/prices/${currency}-USD/spot?date=${date.toISOString()}`
    });

    const response = await client.request(request, CoinbaseExchangeRateSchema);

    let rate = new BigNumber(response.data.amount);
    if (response.data.base !== currency) {
        rate = new BigNumber(1).dividedBy(rate);
    }
    return rate;
};

const addHeadersToRequest = (req: IRequest) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const method = req.method ?? "GET";
    const body = req.body ?? "";
    
    const secret = process.env.COINBASE_SECRET ?? "";
    const message = timestamp + method + req.endpoint + body;
    const signature = createHmac("sha256", secret)
        .update(message)
        .digest("hex");

    const originalHeaders = req.headers ?? { };
    req.headers = {
        ...originalHeaders,
        "CB-ACCESS-SIGN": signature,
        "CB-ACCESS-TIMESTAMP": timestamp.toString()
    };
    return req;
};