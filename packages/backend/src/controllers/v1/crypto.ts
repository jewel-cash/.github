import { Get, Post, Route, Body, SuccessResponse } from "tsoa";
import { createAddress } from "../../modules/coinbase.js";
import { createChallenge, verifyChallenge } from "../../modules/pow.js";
import { HttpError } from "../../modules/error.js";
import { PendingPayment } from "../../entities/pending.js";
import { CoinbaseAccount } from "../../entities/coinbaseaccount.js";
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
}