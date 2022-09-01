import { BigNumber } from "bignumber.js";
import { createHmac } from "crypto";

export const createAddress = async (account: string, id: string) => {
    const json = await request({
        method: "POST",
        endpoint: `/v2/accounts/${account}/addresses`,
        body: JSON.stringify({ name: id })
    });
    return json.data.address as string;
};

export const getAllAccounts = async () => {
    let accounts: Array<any> = [];
    let next = "/v2/accounts";
    while (next != null) {
        const json = await request({
            endpoint: next
        });
        next = json.pagination.next_uri;

        accounts = accounts.concat(<any[]> json.data);
    }
    return accounts;
};

export const getExchangeRate = async (currency: string, timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const json = await request({
        endpoint: `/v2/prices/${currency}-USD/spot?date=${date.toISOString()}`
    });

    let rate = new BigNumber(json.data.amount as string);
    if (json.data.base !== currency) {
        rate = new BigNumber(1).dividedBy(rate);
    }
    return rate;
};

export const getExchangeRates = async () => {
    const json = await request({
        endpoint: "/v2/exchange-rates"
    });
    const dict = Object.entries(json.data.rates) as [string, number][];
    return new Map(dict);
};

interface IRequest {
    method?: string,
    endpoint: string,
    body?: string,
    headers?: Record<string, string>
}

const request = async (req: IRequest) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const method = req.method ?? "GET";
    const body = req.body ?? "";
    
    const secret = process.env.COINBASE_SECRET ?? "";
    const message = timestamp + method + req.endpoint + body;
    const signature = createHmac("sha256", secret)
        .update(message)
        .digest("hex");

    const originalHeaders = req.headers ?? { };
    const headers: HeadersInit = {
        ...originalHeaders,
        "Content-Type": "application/json",
        "CB-ACCESS-SIGN": signature,
        "CB-ACCESS-TIMESTAMP": timestamp.toString(),
        "CB-ACCESS-KEY": process.env.COINBASE_KEY ?? "",
        "CB-VERSION": "2022-03-03"
    };

    const url: RequestInfo = "https://api.coinbase.com" + req.endpoint;
    const request: RequestInit = {
        headers,
        method,
        body: req.body
    };
    const res = await fetch(url, request);
    return await res.json();
};