import { Delete, Get, Route, Security, Post, Body } from "tsoa";
import type { IInitiateTransactionRequest } from "jewl-core";

@Route("/v1/transaction")
@Security("token")
export class TransactionController {

    @Get("/tokens")
    public getAllTokens(): void {
        // Includes suggested split
        console.log("A");
    }

    @Post("/initiate")
    public initiateTransaction(@Body() _: IInitiateTransactionRequest): void {
        // Generate transactions and create stripe payment
        console.log("A");
    }

    @Get("/pending")
    public getPendingTransactions(): void {
        console.log("A");
    }

    @Delete("/pending")
    public cancelPendingTransactions(): void {
        console.log("A");
    }

    @Get("/completed")
    public getCompletedTransactions(): void {
        console.log("A");
    }
}
