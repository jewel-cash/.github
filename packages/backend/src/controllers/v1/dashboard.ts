import { BigNumber } from "bignumber.js";
import { Get, Route, Security, Request, Body, Post, SuccessResponse, Delete } from "tsoa";
import { Payment } from "../../entities/payment.js";
import { UserLink } from "../../entities/link.js";
import { nextMonday } from "../../modules/date.js";

interface IOverviewResponse {
    cumlative: string;
    pending: string;
    nextPaymentDate: number;
}

interface ILinkResponse {
    link: string;
}

interface IListResponse {
    from: string;
    message: string;
    amount: string;
    exchangeRate: string;
    proceeds: string;
    fee: string;
}

@Route("/v1/dashboard")
@Security("token")
export class DashboardController {
    @Get("/overview")
    public async getOverview(@Request() req: any): Promise<IOverviewResponse> {
        const payments = await Payment.find({ recipientId: req.user.userId });
        let cumlative = new BigNumber(0);
        let pending = new BigNumber(0);

        for (const key in payments) {
            const payment = payments[key];
            if (payment.payedOut) {
                cumlative = cumlative.plus(payment.proceeds);
            } else {
                pending = pending.plus(payment.proceeds);
            }
        }

        return { 
            cumlative: `${cumlative.toFixed(2)} USD`,
            pending: `${pending.toFixed(2)} USD`,
            nextPaymentDate: nextMonday()
        };
    }

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
        const link = new UserLink({ userId: req.user.userId, link: body.link });
        await link.save();
        return body;
    }

    @Delete("/link")
    @SuccessResponse(204)
    public async DeleteLink(@Request() req: any, @Body() body: ILinkResponse): Promise<void> {
        await UserLink.findOneAndDelete({ userId: req.user.userId, link: body.link });
    }

    @Get("/list")
    public async getList(@Request() req: any): Promise<Array<IListResponse>> {
        const payments = await Payment.find({ recipientId: req.user.userId });
        return payments.map(x => {
            return {
                from: x.name,
                message: x.message,
                amount: `${x.amount} ${x.currency}`,
                exchangeRate: `${x.exchangeRate.toFixed(2)} USD/${x.currency}`,
                proceeds: `${x.proceeds.toFixed(2)} USD`,
                fee: `${x.fee.toFixed(2)} USD`,
            };
        });
    }
}