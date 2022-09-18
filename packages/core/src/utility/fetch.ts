import Ajv, { JTDSchemaType } from "ajv/dist/jtd.js";
const ajv = new Ajv();

export interface IRequest {
    method?: string;
    endpoint: string;
    body?: string;
    headers?: Record<string, string>;
}

export class Client {
    private baseUrl: string;
    private headers: Record<string, string>;

    constructor(baseUrl: string, headers?: Record<string, string>) {
        this.baseUrl = baseUrl;
        this.headers = headers ?? { };
    }

    public updateHeaders(update: Record<string, string>) {
        for (const key in update) {
            this.headers[key] = update[key];
        }
    }

    public async request<T>(req: IRequest, schema: JTDSchemaType<T>): Promise<T> {
        const infix = (this.baseUrl.endsWith("/") || req.endpoint.startsWith("/")) ? "" : "/";
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
        const res = await fetch(url, request);
        if (res.status < 200 && res.status >= 300) { throw new Error(`BadStatusCode${res.status}`); }
        const json = await res.json();

        const validate = ajv.compile(schema);
        if (!validate(json)) { throw validate.errors; }
        return json as T;
    }

}