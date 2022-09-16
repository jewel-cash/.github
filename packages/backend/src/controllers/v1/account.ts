import { Body, Delete, Get, Post, Route, SuccessResponse, Request, Security } from "tsoa";
import { UserLink } from "../../entities/link.js";
import { IStripeAccount, StripeAccount } from "../../entities/stripeaccount.js";
import { createStripeAccount, createStripeLink } from "../../modules/stripe.js";
import type { IAccountLinksResponse, IAccountLinkResponse, IAccountStatus, IAccountStripeLinkRequest, IAccountStripeLinkResponse } from "core";
import { HttpError } from "../../modules/error.js";

@Route("/v1/account")
@Security("token")
export class AccountController {

    @Get("/link")
    public async getLink(@Request() req: any): Promise<IAccountLinksResponse> {
        const links = await UserLink.find({ userId: req.user.userId });
        const mapped = links.map(x => {
            return {
                link: x.link
            };
        });
        return {
            links: mapped
        };
    }

    @Post("/link")
    @SuccessResponse(201)
    public async createLink(@Request() req: any, @Body() body: IAccountLinkResponse): Promise<IAccountLinkResponse> {
        if (body.link.length < 3) { throw new HttpError(400, "Link needs to be at least 3 characters."); }
        const existingLink = await UserLink.findOne({ link: body.link });
        if (existingLink != null) { throw new HttpError(400, `Link "${body.link}" is already taken.`); }
        const userLinks = await UserLink.find({ userId: req.user.userId });
        if (userLinks.length >= 5) { throw new HttpError(400, "Maximum ammount of links already assinged."); }
        const link = new UserLink({ userId: req.user.userId, link: body.link });
        await link.save();
        return body;
    }

    @Delete("/link")
    @SuccessResponse(204)
    public async DeleteLink(@Request() req: any, @Body() body: IAccountLinkResponse): Promise<void> {
        await UserLink.findOneAndDelete({ userId: req.user.userId, link: body.link });
    }

    @Get("/status")
    public async getAccountStatus(@Request() req: any): Promise<IAccountStatus> {
        const account = await this.getOrCreateStripeAccount(req.user.userId);
        return {
            onboarded: account.onboarded
        };
    }

    @Post("/stripe")
    public async getStripeLink(@Request() req: any, @Body() body: IAccountStripeLinkRequest): Promise<IAccountStripeLinkResponse> {
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