import { BigNumber } from "bignumber.js";
import { Body, Hidden, Post, Route, Security, SuccessResponse } from "tsoa";
import { Payment, PendingPayment } from "../../entities/payment.js";
import { getExchangeRate } from "../../modules/coinbase.js";
import { HttpError } from "../../modules/error.js";

@Route("/v1/webhook")
export class WebhookController {

    @Post("/coinbase")
    @Security("coinbase")
    @Hidden()
    @SuccessResponse("204")
    public async receivedCoinbaseWebhook(@Body() body: any): Promise<void> {
        if (body.type === "wallet:addresses:new-payment") {
            const id: string = body.data.name ?? "";
            const createdDate: string = body.created_at ?? "";
            const timestamp = new Date(createdDate).toUnix();
            const currency: string = body.additional_data.amount.currency ?? "";
            const amount = new BigNumber(body.additional_data.amount.amount as string);
            const transactionHash: string = body.additional_data.hash ?? "";
            const pending = await PendingPayment.findById(id);
            if (pending == null) { throw new HttpError(404, `No pending payment found for ${id}.`);}
            const exchangeRate = await getExchangeRate(currency, timestamp);
            const usdEquivalent = amount.multipliedBy(exchangeRate);
            const fee = usdEquivalent.multipliedBy(0.15);
            const proceeds = usdEquivalent.minus(fee);

            const payment = new Payment({
                pendingId: pending.id,
                transactionHash, 
                name: pending.name,
                message: pending.message,
                recipientId: pending.recipientId,
                currency,
                amount,
                timestamp,
                exchangeRate,
                proceeds,
                fee
            });

            await payment.save();
        }
    }
}