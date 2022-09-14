import { Get, Post, Route, Body, SuccessResponse } from "tsoa";
import { createAddress } from "../../modules/coinbase.js";
import { createChallenge, verifyChallenge } from "../../modules/pow.js";
import { HttpError } from "../../modules/error.js";
import { PendingPayment } from "../../entities/pending.js";
import { CoinbaseAccount } from "../../entities/coinbaseaccount.js";
import { UserLink } from "../../entities/link.js";
import type { ICryptoTokensResponse, ICryptoTokenResponse, ICryptoChallengeResponse, ICryptoAddressRequest, ICryptoAddressResponse } from "core";

@Route("/v1/crypto")
export class CryptoController {

    @Get("/tokens")
    public async getAllTokens(): Promise<ICryptoTokensResponse> {
        const accounts = await CoinbaseAccount.find();
        const tokens: Array<ICryptoTokenResponse> = accounts.map(x => {
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
    public async getChallenge(): Promise<ICryptoChallengeResponse> {
        const challenge = createChallenge();
        return {
            challenge
        };
    }

    @Post("/address")
    @SuccessResponse("201")
    public async createNewAddress(@Body() body: ICryptoAddressRequest): Promise<ICryptoAddressResponse> {
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
}