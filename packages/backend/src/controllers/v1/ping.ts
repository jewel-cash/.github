import { Get, Route } from "tsoa";

interface IPingResponse {
    message: string
}

@Route("/v1/ping")
export class PingController {
    @Get("/")
    public async getMessage(): Promise<IPingResponse> {
        return { message: "pong" };
    }
}