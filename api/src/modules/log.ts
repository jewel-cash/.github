import { Application, NextFunction } from "express";
import type { IncomingMessage, ServerResponse } from "node:http";
import chalk from "chalk";
import onFinished from "on-finished";

export const RegisterLogger = (app: Application) => {
    app.use((req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
        const requestTime = new Date();
        const formattedTime = `${requestTime.toLocaleDateString()} ${requestTime.toLocaleTimeString()}`;
        const ipAddress = req.socket.remoteAddress?.replace("::ffff:", "") ?? "unknown";
        const requestUrl = `${req.method ?? "GET"} ${req.url ?? "/"}`;
        
        console.info(
            chalk.bgBlue.bold(" HTTP "),
            chalk.dim(formattedTime),
            chalk.yellow(ipAddress),
            chalk.cyan(requestUrl)
        );

        onFinished(res, (_: Error | null, res: ServerResponse<IncomingMessage>) => {
            const responseTime = Date.now() - requestTime.getTime();
            console.info(
                chalk.bgBlue.bold(" HTTP "),
                chalk.dim(formattedTime),
                chalk.yellow(ipAddress),
                chalk[res.statusCode < 400 ? "green" : "red"](`Returned ${res.statusCode} in ${responseTime} ms`)
            );
        });

        next();
    });
};