import { Get, Route, Security } from "tsoa";

interface IPingResponse {
    message: string
}

@Route("/v1/dashboard")
@Security("token")
export class DashboardController {
    @Get("/")
    public async getMessage(): Promise<IPingResponse> {
        return { message: "pong" };
    }
}