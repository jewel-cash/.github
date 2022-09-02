import { Get, Post, Route, Body, SuccessResponse, Security, Hidden } from "tsoa";
import { createAddress, getExchangeRate } from "../../modules/coinbase.js";
import { createChallenge, verifyChallenge } from "../../modules/pow.js";
import { HttpError } from "../../modules/error.js";
import { PendingPayment } from "../../entities/pending.js";
import { Payment } from "../../entities/payment.js";
import { CoinbaseAccount } from "../../entities/account.js";
import { BigNumber } from "bignumber.js";
import { UserLink } from "../../entities/link.js";

interface ITokensResponse {
    tokens: Array<ITokensResponseElement>;
}

interface ITokensResponseElement {
    currency: string;
    color: string;
    icon: string;
}

interface IChallengeResponse {
    challenge: string;
}

interface IAddressRequest {
    currency: string;
    link: string;
    name: string;
    message: string;
    challenge: string;
    challengeResponse: string;
}

interface IAddressResponse {
    address: string;
}

@Route("/v1/crypto")
export class CryptoController {

    @Get("/tokens")
    public async getAllTokens(): Promise<ITokensResponse> {
        const accounts = await CoinbaseAccount.find();
        const tokens: Array<ITokensResponseElement> = accounts.map(x => {
            return {
                currency: x.currency,
                color: x.color,
                icon: x.icon
            };
        });
        return {
            tokens
        };
    }

    @Get("/challenge")
    public async getChallenge(): Promise<IChallengeResponse> {
        const challenge = createChallenge();
        return {
            challenge
        };
    }

    @Post("/address")
    @SuccessResponse("201")
    public async createNewAddress(@Body() body: IAddressRequest): Promise<IAddressResponse> {
        verifyChallenge(body.challenge, body.challengeResponse);

        const recipientId = await UserLink.findOne({ link: body.link });
        if (recipientId == null) { throw new HttpError(404, `Link ${body.link} not found.`);}

        const pendingPayment = new PendingPayment({ name: body.name, message: body.message, recipientId: recipientId });
        await pendingPayment.save();

        const address = await createAddress(body.currency, pendingPayment.id);
        //TODO: warning messages
        return {
            address
        };
    }

    @Post("/notification")
    @Security("coinbase")
    @Hidden()
    @SuccessResponse("204")
    public async receivedNotification(@Body() body: any): Promise<void> {
        if (body.type === "ping") {
            return;
        }

        if (body.type === "wallet:addresses:new-payment") {
            const id: string = body.data.name ?? "";
            const createdDate: string = body.data.created_at ?? "";
            const timestamp = new Date(createdDate).toUnix();
            const currency: string = body.additional_data.amount.currency ?? "";
            const amount = new BigNumber(body.additional_data.amount.amount as string);

            const pending = await PendingPayment.findById(id);
            if (pending == null) { throw new HttpError(404, `No pending payment found for ${id}.`);}
            const exchangeRate = await getExchangeRate(currency, timestamp);
            const usdEquivalent = amount.multipliedBy(exchangeRate);
            const fee = usdEquivalent.multipliedBy(0.1); //TODO: Cascading fee?
            const proceeds = usdEquivalent.minus(fee);

            const payment = new Payment({
                pendingId: pending.id,
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

            //TODO: send webhook

            return;
        }

        throw new HttpError(400, `The notification type ${body.type} is unsupported.`);
    }
}