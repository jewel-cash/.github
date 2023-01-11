import { DateTime, TransactionState } from "jewl-core";
import { Task } from "./task";


export class OrdersTask extends Task {

    public async finalize(): Promise<void> {
        for (const transaction of this.pending) {
            transaction.notBefore = new DateTime();
            transaction.state = TransactionState.purchaseInitiated;
            await transaction.save();
        }
    }
}