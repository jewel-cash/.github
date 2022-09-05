import { Body, Delete, Get, Post, Route, SuccessResponse, Request, Security } from "tsoa";
import { UserLink } from "../../entities/link.js";
import { IStripeAccount, StripeAccount } from "../../entities/stripeaccount.js";
import { createStripeAccount, createStripeLink } from "../../modules/stripe.js";

interface ILinkResponse {
    link: string;
}

interface IStripeStatusResponse {
    onboarded: boolean;
}

interface IStripeLinkRequest {
    refresh: string;
    redirect: string;
}

interface IStripeLinkResponse {
    redirect: string;
    expires: number;
}

@Route("/v1/account")
@Security("token")
export class AccountController {

    @Get("/link")
    public async getLink(@Request() req: any): Promise<Array<ILinkResponse>> {
        const links = await UserLink.find({ userId: req.user.userId });
        return links.map(x => {
            return {
                link: x.link
            };
        });
    }

    @Post("/link")
    @SuccessResponse(201)
    public async createLink(@Request() req: any, @Body() body: ILinkResponse): Promise<ILinkResponse> {
        //TODO: max 5
        const link = new UserLink({ userId: req.user.userId, link: body.link });
        await link.save();
        return body;
    }

    @Delete("/link")
    @SuccessResponse(204)
    public async DeleteLink(@Request() req: any, @Body() body: ILinkResponse): Promise<void> {
        await UserLink.findOneAndDelete({ userId: req.user.userId, link: body.link });
    }

    @Get("/stripe")
    public async getStripeStatus(@Request() req: any): Promise<IStripeStatusResponse> {
        const account = await this.getOrCreateStripeAccount(req.user.userId);
        return {
            onboarded: account.onboarded
        };
    }

    @Post("/stripe")
    public async getStripeLink(@Request() req: any, @Body() body: IStripeLinkRequest): Promise<IStripeLinkResponse> {
        const account = await this.getOrCreateStripeAccount(req.user.userId);
        console.log(account);
        const link = await createStripeLink(account.stripeId, body.refresh, body.redirect);
        return {
            redirect: link.url,
            expires: link.expires
        };
    }


    private async getOrCreateStripeAccount(userId: string): Promise<IStripeAccount> {
        let account = await StripeAccount.findOne({ userId: userId });
        if (account == null) {
            const response = await createStripeAccount();
            account = new StripeAccount({ 
                userId: userId,
                stripeId: response.id
            });
            await account.save();
        }
        return account;
    }
}