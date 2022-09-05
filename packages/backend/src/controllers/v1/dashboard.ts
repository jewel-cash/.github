import { BigNumber } from "bignumber.js";
import { Get, Route, Security, Request } from "tsoa";
import { Payment } from "../../entities/payment.js";
import { nextMonday } from "core";

interface IOverviewResponse {
    cumlative: string;
    pending: string;
    nextPaymentDate: number;
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