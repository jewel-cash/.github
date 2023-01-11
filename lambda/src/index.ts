import { updateAllTransactions } from "./modules/transaction.js";
import { mongoConnect, mongoDisconnect } from "jewl-core";

await mongoConnect(process.env.MONGO_URL ?? "");

const tasks = [
    updateAllTransactions()
];

await Promise.all(tasks);

await mongoDisconnect();