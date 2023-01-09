import { Body, Delete, Get, Post, Route, SuccessResponse, Request, Security, Put } from "tsoa";
import { UserLink } from "../../entities/link.js";
import type { IAccountLinksResponse, IAccountLinkResponse, IAccountTrolleyWidgetRequest, IAccountTrolleyWidgetResponse } from "core";
import { HttpError } from "../../modules/error.js";
import { createWidgetLink } from "../../modules/trolley.js";

@Route("/v1/account")
@Security("token")
export class AccountController {

    @Get("/links")
    public async getLink(@Request() req: any): Promise<IAccountLinksResponse> {
        const links = await UserLink.find({ userId: req.user.userId });
        const mapped = links.map(x => {
            return {
                slug: x.slug,
                title: x.title,
                description: x.description,
                image: x.image
            };
        });
        return {
            links: mapped
        };
    } 

    @Post("/links")
    @SuccessResponse(201)
    public async createLink(@Request() req: any, @Body() body: IAccountLinkResponse): Promise<IAccountLinkResponse> {
        const existingLink = await UserLink.findOne({ slug: body.slug });
        if (existingLink != null) { throw new HttpError(400, `Link "${body.slug}" is already taken.`); }
        const userLinks = await UserLink.find({ userId: req.user.userId });
        if (userLinks.length >= 5) { throw new HttpError(400, "Maximum ammount of links already assinged."); }
        const link = new UserLink({ 
            userId: req.user.userId, 
            slug: body.slug,
            title: body.title,
            description: body.description,
            image: body.image
        });
        await link.save();
        return body;
    }

    @Put("/links")
    public async updateLink(@Request() req: any, @Body() body: IAccountLinkResponse): Promise<IAccountLinkResponse> {
        const query = { slug: body.slug, userId: req.user.userId };
        const update = { title: body.title, description: body.description, image: body.image };
        const status = await UserLink.updateOne(query, update);
        if (!status.acknowledged || status.modifiedCount !== 1) { throw new HttpError(400, `Update "${body.slug}" failed.`); }
        return body;
    }

    @Delete("/links")
    @SuccessResponse(204)
    public async DeleteLink(@Request() req: any, @Body() body: IAccountLinkResponse): Promise<void> {
        await UserLink.findOneAndDelete({ userId: req.user.userId, link: body.slug });
    }

    @Post("/trolley")
    public async getTrolleyWidget(@Request() req: any, @Body() body: IAccountTrolleyWidgetRequest): Promise<IAccountTrolleyWidgetResponse> {
        return {
            widgetLink: createWidgetLink(req.user.userId, body.email)
        };
    }
}