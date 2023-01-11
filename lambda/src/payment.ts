import { DateTime, TransactionState } from "jewl-core";
import { Task } from "./task";

export class PaymentsTask extends Task {

    public async finalize(): Promise<void> {
        for (const transaction of this.pending) {
            transaction.notBefore = new DateTime();
            transaction.state = TransactionState.paymentInitiated;
            await transaction.save();
        }
    }
}