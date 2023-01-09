import { Get, Route } from "tsoa";
import type { IPingResponse } from "jewel-core";

@Route("/v1/ping")
export class PingController {
    @Get("/")
    public async getMessage(): Promise<IPingResponse> {
        return { message: "pong" };
    }
}