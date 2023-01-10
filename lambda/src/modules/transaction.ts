import { DateTime, ITransaction, Transaction, TransactionState } from "jewl-core";
import { Document } from "mongoose";

export const updateAllTransactions = async () => {
    const cursor = Transaction.find().cursor();
    const processingDate = new DateTime();
    for (let transaction = await cursor.next(); transaction != null; transaction = await cursor.next()) {
        if (transaction.notBefore < processingDate) { continue; }
        switch (transaction.state) {
        case TransactionState.paymentPending: await initiatePayment(transaction); break;
        case TransactionState.paymentInitiated: await checkPaymentStatus(transaction); break;
        case TransactionState.paymentConfirmed: await placeOrder(transaction); break;
        }
    }
};

const initiatePayment = async (transaction: ITransaction & Document) => {
    //TODO: initiate transaction (Only neccesary when we support subscriptions)
    transaction.notBefore = new DateTime();
    transaction.state = TransactionState.paymentInitiated;
    await transaction.save();
};

const checkPaymentStatus = async (transaction: ITransaction & Document) => {
    //TODO: check payment status
    transaction.notBefore = new DateTime();
    transaction.state = TransactionState.paymentConfirmed;
    await transaction.save();
};

const placeOrder = async (transaction: ITransaction & Document) => {
    //TODO: place order at coinbase
    transaction.notBefore = new DateTime();
    transaction.state = TransactionState.purchaseInitiated;
    await transaction.save();
};

// export const updateStripeStatus = (transaction: ITransaction) => {
    
// };
