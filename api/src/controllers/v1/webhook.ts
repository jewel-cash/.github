import { BigNumber } from "bignumber.js";
import { Body, Hidden, Post, Route, Security, SuccessResponse } from "tsoa";
import { Transaction, PendingTransaction } from "../../entities/transaction.js";
import { getExchangeRate } from "../../modules/coinbase.js";

@Route("/v1/webhook")
export class WebhookController {

    @Post("/coinbase")
    @Security("coinbase")
    @Hidden()
    @SuccessResponse("204")
    public async receivedCoinbaseWebhook(@Body() body: any): Promise<void> {
        if (body.type === "wallet:addresses:new-payment") {
            const id: string = body.data.name ?? "";
            if (id === "") { return; }
            const createdDate: string = body.created_at ?? "";
            const timestamp = new Date(createdDate).toUnix();
            const currency: string = body.additional_data.amount.currency ?? "";
            const amount = new BigNumber(body.additional_data.amount.amount as string);
            const transactionHash: string = body.additional_data.hash ?? "";
            const pending = await PendingTransaction.findById(id);
            if (pending == null) { return; }
            const exchangeRate = await getExchangeRate(currency, timestamp);
            const usdEquivalent = amount.multipliedBy(exchangeRate);
            const fee = usdEquivalent.multipliedBy(0.15);
            const proceeds = usdEquivalent.minus(fee);

            const payment = new Transaction({
                pendingId: pending.id,
                hash: `${currency}|${transactionHash}`, 
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