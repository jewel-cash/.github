import { Body, Hidden, Post, Route, Security, SuccessResponse } from "tsoa";

@Route("/v1/webhook")
@Hidden()
export class WebhookController {

    @Post("/coinbase")
    @Security("coinbase")
    @SuccessResponse("204")
    public receivedCoinbaseWebhook(@Body() body: object): void {
        console.log(body);
    }

    @Post("/stripe")
    @Security("stripe")
    @SuccessResponse("204")
    public receivedStripeWebhook(@Body() body: object): void {
        console.log(body);
    }
}
