import { Get, Route } from "tsoa";

@Route("/v1/ping")
export class PingController {
    @Get("/")
    public async getMessage(): Promise<string> {
        return "pong";
    }
}