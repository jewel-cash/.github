import { schedule, ScheduledTask } from "node-cron";
import { Application } from "express";
import { getAllAccounts } from "./coinbase.js";
import { CoinbaseAccount } from "../entities/account.js";

interface CronJobs { 
    [key: string]: () => Promise<void>
}

export const RegisterCronsJobs = (_: Application) => {
    scheduleJobs("0 * * * *", {
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
    const cbAccounts = accounts.map(x => {
        return {
            coinbaseId: x.id,
            currency: x.currency.code,
            color: x.currency.color,
            icon: `https://assets.coincap.io/assets/icons/${x.currency.code.toLowerCase()}@2x.png`
        };
    });
    await CoinbaseAccount.deleteMany();
    await CoinbaseAccount.insertMany(cbAccounts);
};