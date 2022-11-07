import { BigNumber } from "bignumber.js";
import { Get, Route, Security, Hidden } from "tsoa";
import { Transaction } from "../../entities/transaction.js";
import { nextMonday } from "core";
import type { IAdminOverviewResponse, IAdminTransactionsResponse, IAdminUsersResponse } from "core";

@Route("/v1/admin")
@Security("admin")
@Hidden()
export class AdminController {
    @Get("/overview")
    public async getOverview(): Promise<IAdminOverviewResponse> {
        const payments = await Transaction.find();

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
            uniqueUsers: 0,
            payedOut: payedOut.toNumber(),
            pendingPayments: pendingPayments.toNumber(),
            feesCollected: feesCollected.toNumber(),
            unearnedFees: unearnedFees.toNumber(),
            nextPaymentDate: nextMonday()
        };
    }

    @Get("/transactions")
    public async getTransactions(): Promise<IAdminTransactionsResponse> {
        const payments = await Transaction.find();
        const transactions = payments.map(x => {
            return {
                recipient: x.recipientId,
                amount: x.amount.toNumber(),
                currency: x.currency,
                exchangeRate: x.exchangeRate.toNumber(),
                proceeds: x.proceeds.toNumber(),
                fee: x.fee.toNumber()
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