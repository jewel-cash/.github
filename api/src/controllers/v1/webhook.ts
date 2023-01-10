import { Body, Hidden, Post, Route, Security, SuccessResponse } from "tsoa";

@Route("/v1/webhook")
@Hidden()
export class WebhookController {

    @Post("/coinbase")
    @Security("coinbase")
    @SuccessResponse("204")
    public async receivedCoinbaseWebhook(@Body() body: any): Promise<void> {
        console.log(body.type);
    }

    @Post("/stripe")
    @Security("stripe")
    @SuccessResponse("204")
    public async receivedStripeWebhook(@Body() body: any): Promise<void> {
        console.log(body.type);
    }
}