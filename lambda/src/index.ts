import { getAndStoreTokens } from "./modules/tokens";
import { updateAllTransactions } from "./modules/transaction";

const tasks = [
    getAndStoreTokens,
    updateAllTransactions
];

await Promise.all(tasks);