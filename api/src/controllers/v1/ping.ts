import { Get, Route } from "tsoa";
import type { IPingResponse } from "jewl-core";

@Route("/v1/ping")
export class PingController {
    @Get("/")
    public getMessage(): IPingResponse {
        return { message: "pong" };
    }
}
