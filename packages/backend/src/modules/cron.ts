import { schedule } from "node-cron";
import { Application } from "express";
import { getAllAccounts } from "./coinbase.js";
import { CoinbaseAccount } from "../entities/coinbase.js";

interface CronJobs { 
    [key: string]: () => Promise<void>;
}

const hourly = "0 * * * *";

export const RegisterCronsJobs = (_: Application) => {
    scheduleJobs(hourly, {
        getCoinbaseAccounts
    });
};

const scheduleJobs = (cron: string, jobs: CronJobs) => {
    schedule(cron, () => runJobs(jobs));
    runJobs(jobs);
};

const runJobs = async (jobs: CronJobs) => {
    for (const key in jobs) {
        console.log(`Cron ${key}`);
        try {
            await jobs[key]();
        } catch (error) {
            console.log(error);
        }
    }
};

const getCoinbaseAccounts = async () => {
    const accounts = await getAllAccounts();
    const cbAccounts = accounts
        .filter(x => x.currency.type === "crypto")
        .filter(x => x.primary)
        .filter(x => x.currency.slug != null)
        .map(x => {
            return {
                coinbaseId: x.id,
                currency: x.currency.code,
                color: x.currency.color,
                icon: `https://assets.coincap.io/assets/icons/${x.currency.code.toLowerCase()}@2x.png`,
                slug: x.currency.slug,
                name: x.currency.name,
                position: x.currency.sort_index
            };
        });
    await CoinbaseAccount.deleteMany();
    await CoinbaseAccount.insertMany(cbAccounts);
};