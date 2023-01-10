import { Model } from "mongoose";

export interface IRequest {
    method?: string;
    endpoint: string;
    body?: string;
    headers?: Record<string, string>;
}

export class Client {
    private baseUrl: string;
    private headers: Record<string, string>;
    private fetch: (url: string, req: any) => any;

    constructor(baseUrl: string, fetch: (url: any, req: any) => any, headers?: Record<string, string> ) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        this.headers = headers ?? { };
        this.fetch = fetch;
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
        const res = await this.fetch(url, request);
        if (res.status < 200 && res.status >= 300) { throw new Error(`received a status code of ${res.status}`); }
        const json = await res.json();
        const model = new schema(json);
        return new Promise<T>((resolve, reject) => {
            model.validate((err) => {
                err == null ? resolve(model) : reject(err);
            });
        });
    }
}