import { Application, NextFunction, Request, Response } from "express";
import { HttpError } from "./error.js";

export const RegisterErrorCatcher = (app: Application) => {
    app.use((req: Request) => {
        throw new HttpError(404, `"${req.url}" is not found.`);
    });
    
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err.status || 500).send(err.message);
    });
};