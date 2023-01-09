import express, { Application, Request } from "express";

declare global {
    namespace Express {
        interface Request {
            rawBody: Buffer;
        }
    }
}

export const RegisterRequestParser = (app: Application) => {
    app.use(express.json({
        verify: (req: Request, _, buf) => {
            req.rawBody = buf;
        }
    }));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static("./public"));
};