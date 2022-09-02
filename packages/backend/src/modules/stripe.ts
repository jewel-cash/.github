import dotenv from "dotenv";

dotenv.config();

const stripeKey = process.env.STRIPE_KEY ?? "";
const client = new Stripe(stripeKey, { apiVersion: "2022-08-01" });

export const createStripeAccount = async () => {
    return await client.accounts.create({
        type: 'express'
    });
}

export const createStripeLink = async (id: string, refreshUrl: string, returnUrl: string) => {
    return await client.accountLinks.create({
        account: id,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
    }); 
}


// export class StripeSource extends DataSource {
//     //TODO: create account. Store id in the DB. If already an id skip this.
//     //TODO: retrieve account
//     //TODO: if not completed create link 
//     //TODO: create link

// }

// export const createExpressAccount = async () => {
//     const account = await client.accounts.create({type: 'express'});
//     const accountLink = 
// const account = await stripe.accounts.retrieve(
//     'acct_1LVJj5Jjgug2dvSk'
//   );
// }

