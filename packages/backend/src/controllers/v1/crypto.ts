import { Get, Post, Route, Body, Request, SuccessResponse } from "tsoa";
import { createAddress } from "../../modules/coinbase.js";
import { createChallenge, verifyChallenge } from "../../modules/pow.js";
import { HttpError } from "../../modules/error.js";
import { CoinbaseAccount } from "../../entities/coinbase.js";
import { UserLink } from "../../entities/link.js";
import type { ICryptoTokensRequest, ICryptoTokensResponse, ICryptoTokenResponse, ICryptoChallengeResponse, ICryptoAddressRequest, ICryptoAddressResponse } from "core";
import { PendingTransaction } from "../../entities/transaction.js";

@Route("/v1/crypto")
export class CryptoController {

    @Post("/tokens")
    public async getAllTokens(@Body() body: ICryptoTokensRequest): Promise<ICryptoTokensResponse> {
        const link = await UserLink.findOne({ link: body.link });
        if (link == null) { throw new HttpError(404, `Link "${body.link}" not found.`); }

        const accounts = await CoinbaseAccount.find().sort({ position: "asc" });
        const tokens: Array<ICryptoTokenResponse> = accounts.map(x => {
            return {
                currency: x.currency,
                color: x.color,
                icon: x.icon,
                slug: x.slug,
                name: x.name
            };
        });
        return {
            tokens,
            title: link.title,
            description: link.description,
            image: link.image
        };
    }

    @Get("/challenge")
    public async getChallenge(@Request() req: any): Promise<ICryptoChallengeResponse> {
        const challenge = await createChallenge(req.ip);
        return {
            challenge
        };
    }

    @Post("/address")
    @SuccessResponse("201")
    public async createNewAddress(@Request() req: any, @Body() body: ICryptoAddressRequest): Promise<ICryptoAddressResponse> {
        await verifyChallenge(body.challenge, req.ip);

        const userLink = await UserLink.findOne({ link: body.link });
        if (userLink == null) { throw new HttpError(404, `Link "${body.link}" not found.`);}
        const pendingPayment = new PendingTransaction({ name: body.name, message: body.message, recipientId: userLink.userId });
        await pendingPayment.save();

        const account = await CoinbaseAccount.findOne({ slug: body.currency });
        if (account == null) { throw new HttpError(404, `Account "${body.currency}" not found.`);}

        const address = await createAddress(account.coinbaseId, pendingPayment.id);
        return {
            address
        };
    }
}