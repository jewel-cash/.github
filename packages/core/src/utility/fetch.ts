import Ajv, { JTDSchemaType } from "ajv/dist/jtd.js";
const ajv = new Ajv.default();

export interface IRequest {
    method?: string;
    endpoint: string;
    body?: string;
    headers?: Record<string, string>;
}

export class Client {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async request<T>(req: IRequest, schema: JTDSchemaType<T>): Promise<T> {
        const infix = (this.baseUrl.endsWith("/") || req.endpoint.startsWith("/")) ? "" : "/";
        const url: RequestInfo = this.baseUrl + infix + req.endpoint;
        const request: RequestInit = {
            headers: req.headers ?? { },
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