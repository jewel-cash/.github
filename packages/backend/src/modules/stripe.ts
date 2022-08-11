import { Stripe} from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeKey = process.env.STRIPE_KEY ?? "";
export const client = new Stripe(stripeKey, { apiVersion: "2022-08-01" });

// export class StripeSource extends DataSource {
//     //TODO: create account. Store id in the DB. If already an id skip this.
//     //TODO: retrieve account
//     //TODO: if not completed create link 
//     //TODO: create link

// }

// export const createExpressAccount = async () => {
//     const account = await client.accounts.create({type: 'express'});
//     const accountLink = await client.accountLinks.create({
//         account: account.id,
//         refresh_url: 'https://example.com/reauth',
//         return_url: 'https://example.com/return',
//         type: 'account_onboarding',
//       });
// const account = await stripe.accounts.retrieve(
//     'acct_1LVJj5Jjgug2dvSk'
//   );
// }

