import { Body, Hidden, Post, Route, Security, SuccessResponse } from "tsoa";

@Route("/v1/webhook")
export class WebhookController {

    @Post("/coinbase")
    @Security("coinbase")
    @Hidden()
    @SuccessResponse("204")
    public async receivedCoinbaseWebhook(@Body() body: any): Promise<void> {
        console.log(body.type);
    }

    @Post("/stripe")
    @Security("stripe")
    @Hidden()
    @SuccessResponse("204")
    public async receivedStripeWebhook(@Body() body: any): Promise<void> {
        console.log(body.type);
    }
}