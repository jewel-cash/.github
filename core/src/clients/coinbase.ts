import { Model } from "mongoose";
import { CoinbaseProducts, ICoinbaseProduct } from "../entities/coinbase.js";
import { Client, IRequest } from "../utility/client.js";
import isomorphic from "jewl-isomorphic";

export class CoinbasePublicClient extends Client {
    public constructor() {
        const staticHeaders: Record<string, string> = {
            "Content-Type": "application/json"
        };
        super("https://api.exchange.coinbase.com", staticHeaders);
    }

    public async getProducts(): Promise<Array<ICoinbaseProduct>> {
        const request: IRequest = {
            endpoint: "/products"
        };

        const response = await this.request(request, CoinbaseProducts);

        return response.list
            .filter(x => x.base_currency === "EUR" || x.quote_currency === "EUR");
    }
}

export class CoinbaseClient extends Client {
    private secret: string;

    public constructor(key: string, secret: string) {
        const staticHeaders: Record<string, string> = {
            "Content-Type": "application/json",
            "CB-ACCESS-KEY": key,
            "CB-VERSION": "2022-03-03"
        };
        super("https://api.exchange.coinbase.com", staticHeaders);
        this.secret = secret;
    }

    public async request<T>(req: IRequest, schema: Model<T>): Promise<T> {
        const timestamp = Math.floor(Date.now() / 1000);
        const method = req.method ?? "GET";
        const body = req.body ?? "";
        
        const message = timestamp + method + req.endpoint + body;
        const signature = isomorphic.sha256Hmac(message, this.secret);

        const originalHeaders = req.headers ?? { };
        req.headers = {
            ...originalHeaders,
            "CB-ACCESS-SIGN": signature,
            "CB-ACCESS-TIMESTAMP": timestamp.toString()
        };
        return super.request(req, schema);
    }
}