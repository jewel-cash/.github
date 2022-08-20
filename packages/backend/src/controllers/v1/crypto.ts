import { Get, Post, Route, Request, Body, SuccessResponse } from "tsoa";
import { createAddress, getExchangeRate } from "../../modules/coinbase.js";
import { v4 as uuid } from "uuid";
import { createChallenge, verifyChallenge } from "../../modules/pow.js";
import { HttpError } from "../../modules/error.js";
import { PendingPayment } from "../../entities/pending.js";
import { Payment } from "../../entities/payment.js";
import { CoinbaseAccount } from "../../entities/account.js";
import { createVerify } from "crypto";

interface ITokensResponse {
    tokens: Array<ITokensResponseElement>;
}

interface ITokensResponseElement {
    currency: string;
    color: string;
    icon: string;
}

interface IChallengeResponse {
    challenge: string
}

interface IAddressRequest {
    currency: string;
    userId: string;
    message: string;
    challenge: string;
    challengeResponse: string;
}

interface IAddressResponse {
    address: string
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
        try {
            verifyChallenge(body.challenge, body.challengeResponse);
        } catch {
            throw new HttpError(403, "The response to the challenge is invalid.");
        }
        
        const id = uuid();

        const pendingPayment = new PendingPayment({ id: id, message: body.message, recipientId: body.userId });
        await pendingPayment.save();

        const address = await createAddress(body.currency, id);
        //TODO: warning messages
        return {
            address
        };
    }

    @Post("/notification")
    @SuccessResponse("204")
    public async receivedNotification(@Request() req: any, @Body() body: any): Promise<void> {
        if (req.ip !== "54.175.255.192/27") { throw new HttpError(403, `Source ${req.ip} not allowed to query "${req.url}"`); }

        const signature = req.header("CB-SIGNATURE") ?? "";
        const rawBody = req.body ?? "";
        const pubKey = process.env.COINBASE_PUB_KEY ?? "";
        const verify = createVerify("RSA-SHA256")
            .update(rawBody)
            .verify(pubKey, signature, "base64");
        if (!verify) { throw new HttpError(403, "Could not verify the signature of the request."); }

        if (body.type === "ping") {
            return;
        }

        if (body.type === "wallet:addresses:new-payment") {
            const id: string = body.data.name ?? "";
            const createdDate: string = body.data.created_at ?? "";
            const timestamp = Math.floor(new Date(createdDate).getTime() / 1000);
            const currency: string = body.additional_data.amount.currency ?? "";
            const amount: number = body.additional_data.amount.amount ?? 0;

            const pending = await PendingPayment.findOne({ id: id });
            const exchangeRate = await getExchangeRate(currency, timestamp);

            const payment = new Payment({
                ...pending,
                currency,
                amount,
                timestamp,
                exchangeRate: exchangeRate,
                usdEquivalent: amount * exchangeRate,
            });

            await payment.save();

            //TODO: send webhook
        }

        throw new HttpError(400, `The notification type ${body.type} is currently unhandled.`);
    }
}