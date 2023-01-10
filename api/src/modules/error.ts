import { Application, NextFunction, Request, Response } from "express";
import chalk from "chalk";

export class HttpError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export const RegisterErrorCatcher = (app: Application) => {
    app.use((req: Request) => {
        throw new HttpError(404, `"${req.url}" is not found.`);
    });
    
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        if (process.env.DEBUG === "true") {
            console.error(chalk.bgRed.bold(" ERROR "), err);
        }
        res.status(err.status || 500).send(err.message);
    });
};