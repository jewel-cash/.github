import { Delete, Get, Route, Security, Post, Body } from "tsoa";
import type { IInitiateTransactionRequest } from "jewl-core";

@Route("/v1/transaction")
@Security("token")
export class TransactionController {

    @Get("/tokens")
    public async getAllTokens(): Promise<void> {
        //includes suggested split
        console.log("A");
    }
    
    @Post("/initiate")
    public async initiateTransaction(@Body() _: IInitiateTransactionRequest): Promise<void> {
        // generate transactions and create stripe payment
        console.log("A");
    }

    @Get("/pending")
    public async getPendingTransactions(): Promise<void> {
        console.log("A");
    }

    @Delete("/pending")
    public async cancelPendingTransactions(): Promise<void> {
        console.log("A");
    }

    @Get("/completed")
    public async getCompletedTransactions(): Promise<void> {
        console.log("A");
    }
}