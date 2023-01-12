import type { ITransaction } from "jewl-core";
import type { Document } from "mongoose";

export abstract class Task {
    protected pending: Array<Document & ITransaction> = [];

    public collect(transaction: Document & ITransaction): void {
        this.pending.push(transaction);
    }

    public abstract finalize(): Promise<void>;
}
