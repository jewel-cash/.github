import { DateTime, mongoConnect, mongoDisconnect, Transaction, TransactionState } from "jewl-core";
import { OrdersTask } from "./order";
import { PaymentsTask } from "./payment";
import { Task } from "./task";
import { TransferTask } from "./transfer";

await mongoConnect(process.env.MONGO_URL ?? "");

const tasks: Map<TransactionState, Task> = new Map([
    [TransactionState.paymentPending, new PaymentsTask()],
    [TransactionState.paymentConfirmed, new OrdersTask()],
    [TransactionState.purchaseCompleted, new TransferTask()]
]);

const processingDate = new DateTime();
const states = Array.from(tasks.keys());
const cursor = Transaction.find({ notBefore: { $lt: processingDate }, state: { $in: states } }).cursor();

for (let transaction = await cursor.next(); transaction != null; transaction = await cursor.next()) {
    const task = tasks.get(transaction.state);
    if (task == null) { continue; }

}

await mongoDisconnect();