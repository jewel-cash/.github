import { BigNumber } from "bignumber.js";
import { Get, Route, Security, Request } from "tsoa";
import { Payment } from "../../entities/payment.js";
import { nextMonday } from "core"; 
import type { IDashboardOverviewResponse, IDashboardTransactionsResponse } from "core";

@Route("/v1/dashboard")
@Security("token")
export class DashboardController {
    @Get("/overview")
    public async getOverview(@Request() req: any): Promise<IDashboardOverviewResponse> {
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

    @Get("/trasactions")
    public async getTransactions(@Request() req: any): Promise<IDashboardTransactionsResponse> {
        const payments = await Payment.find({ recipientId: req.user.userId });
        const transactions = payments.map(x => {
            return {
                from: x.name,
                message: x.message,
                amount: `${x.amount} ${x.currency}`,
                exchangeRate: `${x.exchangeRate.toFixed(2)} USD/${x.currency}`,
                proceeds: `${x.proceeds.toFixed(2)} USD`,
                fee: `${x.fee.toFixed(2)} USD`
            };
        });
        return {
            transactions
        };
    }
}