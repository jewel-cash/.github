import { ITransaction } from "jewl-core";
import { Document } from "mongoose";

export abstract class Task {
    protected pending: Array<ITransaction & Document> = [];

    public collect(transaction: ITransaction & Document) {
        this.pending.push(transaction);
    }

    public abstract finalize(): Promise<void>
}