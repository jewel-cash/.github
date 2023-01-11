import { Model } from "mongoose";
import isomorphic from "jewl-isomorphic";

export interface IRequest {
    method?: string;
    endpoint: string;
    body?: string;
    headers?: Record<string, string>;
}

export class Client {
    private baseUrl: string;
    private headers: Record<string, string>;

    public constructor(baseUrl: string, headers?: Record<string, string> ) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        this.headers = headers ?? { };
    }

    public updateHeaders(update: Record<string, string>) {
        for (const key in update) {
            this.headers[key] = update[key];
        }
    }

    public async request<T>(req: IRequest, schema: Model<T>): Promise<T> {
        const infix = req.endpoint.startsWith("/") ? "" : "/";
        const url: RequestInfo = this.baseUrl + infix + req.endpoint;
        const headers: HeadersInit = {
            ...this.headers,
            ...req.headers ?? { }
        };
        const request: RequestInit = {
            headers: headers,
            method: req.method,
            body: req.body
        };
        const res = await isomorphic.fetch(url, request);
        if (res.status < 200 && res.status >= 300) { throw new Error(`received a status code of ${res.status}`); }
        let json = await res.json();

        switch (typeof json) {
        case "string": json = { text: json }; break;
        case "number": json = { number: json }; break;
        case "boolean": json = { bool: json }; break;
        case "object": json = Array.isArray(json) ? { list: json } : json;
        }

        const model = new schema(json);
        return new Promise<T>((resolve, reject) => {
            model.validate((err) => {
                err == null ? resolve(model) : reject(err);
            });
        });
    }
}