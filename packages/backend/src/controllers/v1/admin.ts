import { BigNumber } from "bignumber.js";
import { Get, Route, Security, Hidden } from "tsoa";
import { Payment } from "../../entities/payment.js";
import { nextMonday } from "core";
import type { IAdminOverviewResponse, IAdminTransactionsResponse, IAdminUsersResponse } from "core";

@Route("/v1/admin")
@Security("admin")
@Hidden()
export class AdminController {
    @Get("/overview")
    public async getOverview(): Promise<IAdminOverviewResponse> {
        const payments = await Payment.find();

        let payedOut = new BigNumber(0);
        let pendingPayments = new BigNumber(0);
        let feesCollected = new BigNumber(0); 
        let unearnedFees = new BigNumber(0);

        for (const key in payments) {
            const payment = payments[key];
            if (payment.payedOut) {
                payedOut = payedOut.plus(payment.proceeds);
                feesCollected = feesCollected.plus(payment.fee);
            } else {
                pendingPayments = pendingPayments.plus(payment.proceeds);
                unearnedFees = unearnedFees.plus(payment.fee);
            }
        }

        return {
            users: "0 unique users",
            payedOut: `${payedOut.toFixed(2)} USD`,
            pendingPayments: `${pendingPayments.toFixed(2)} USD`,
            feesCollected: `${feesCollected.toFixed(2)} USD`,
            unearnedFees: `${unearnedFees.toFixed(2)} USD`,
            nextPaymentDate: nextMonday()
        };
    }

    @Get("/transactions")
    public async getTransactions(): Promise<IAdminTransactionsResponse> {
        const payments = await Payment.find();
        const transactions = payments.map(x => {
            return {
                recipient: x.recipientId,
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

    @Get("/users")
    public async getUsers(): Promise<IAdminUsersResponse> {
        return { 
            users: []
        };
    }
}