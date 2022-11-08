import { BigNumber } from "bignumber.js";
import { Get, Route, Security, Request } from "tsoa";
import { Transaction } from "../../entities/transaction.js";
import { DashboardTransactionResponseSchema, nextMonday } from "core"; 
import type { IDashboardOverviewResponse, IDashboardTransactionsResponse } from "core";

@Route("/v1/dashboard")
@Security("token")
export class DashboardController {
    @Get("/overview")
    public async getOverview(@Request() req: any): Promise<IDashboardOverviewResponse> {
        const payments = await Transaction.find({ recipientId: req.user.userId });
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
            cumlative: cumlative.toNumber(),
            pending: pending.toNumber(),
            nextPaymentDate: nextMonday()
        };
    }

    @Get("/trasactions")
    public async getTransactions(@Request() req: any): Promise<IDashboardTransactionsResponse> {
        const payments = await Transaction.find({ recipientId: req.user.userId });
        const transactions = payments.map(x => {
            return {
                from: x.name,
                message: x.message,
                amount: x.amount.toNumber(),
                currency: x.currency,
                exchangeRate: x.exchangeRate.toNumber(),
                proceeds: x.proceeds.toNumber(),
                fee: x.fee.toNumber(),
                timestamp: x.timestamp
            };
        });
        return {
            transactions
        };
    }

    @Get("/export")
    public async exportTransactions(@Request() req: any): Promise<void> {
        const payments = await this.getTransactions(req);
        const keys = Object.keys(DashboardTransactionResponseSchema.properties);
        const values = payments.transactions as Record<string, any>[];

        const data = [
            keys.join(","),
            values.map(t => keys.map(k => `${t[k]}`)).join(",")
        ].join("\n");

        req.res.attachment("transactions.csv");
        req.res.end(Buffer.from(data));
    }
}