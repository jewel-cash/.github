import { Get, Route } from "tsoa";
import { IPingResponse } from "jewl-core";

@Route("/v1/ping")
export class PingController {
    @Get("/")
    public async getMessage(): Promise<IPingResponse> {
        return { message: "pong" };
    }
}