import { BigNumber } from "bignumber.js";
import { Get, Route, Security, Hidden } from "tsoa";
import { Payment } from "../../entities/payment.js";
import { nextMonday } from "../../modules/date.js";

interface IOverviewResponse {
    users: string;
    payedOut: string;
    pendingPayments: string;
    feesCollected: string;
    unearnedFees: string;
    nextPaymentDate: number
}

interface IListResponse {
    recipient: string;
    amount: string;
    exchangeRate: string;
    proceeds: string;
    fee: string;
}

// interface IUsersResponse {
//     userId: string;
//     payedOut: string;
//     pending: string;
//     fees: string;
//     unearnedFees: string;
// }

@Route("/v1/admin")
@Security("admin")
@Hidden()
export class AdminController {
    @Get("/overview")
    public async getOverview(): Promise<IOverviewResponse> {
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

    @Get("/list")
    public async getList(): Promise<Array<IListResponse>> {
        const payments = await Payment.find();
        return payments.map(x => {
            return {
                recipient: x.recipientId,
                amount: `${x.amount} ${x.currency}`,
                exchangeRate: `${x.exchangeRate.toFixed(2)} USD/${x.currency}`,
                proceeds: `${x.proceeds.toFixed(2)} USD`,
                fee: `${x.fee.toFixed(2)} USD`,
            };
        });
    }

    // @Get("/users")
    // public async getUsers(): Promise<Array<IUsersResponse>> {
    //     const payments = await Payment.find();

    //     let payedOut = new Map<string, BigNumber>();
    //     let pendingPayments = new Map<string, BigNumber>();
    //     let feesCollected = new Map<string, BigNumber>(); 
    //     let unearnedFees = new Map<string, BigNumber>();

    //     for (const key in payments) {
    //         const payment = payments[key];
    //         if (payment.payedOut) {
    //             payedOut
    //             payedOut = payedOut.plus(payment.proceeds);
    //             feesCollected = feesCollected.plus(payment.fee);
    //         } else {
    //             pendingPayments = pendingPayments.plus(payment.proceeds);
    //             unearnedFees = unearnedFees.plus(payment.fee);
    //         }
    //     }


    //     return payments.map(x => {
    //         return {
    //             from: x.name,
    //             message: x.message,
    //             amount: `${x.amount} ${x.currency}`,
    //             exchangeRate: `${x.exchangeRate.toFixed(2)} USD/${x.currency}`,
    //             proceeds: `${x.proceeds.toFixed(2)} USD`,
    //             fee: `${x.fee.toFixed(2)} USD`,
    //         }
    //     });
    // }
}