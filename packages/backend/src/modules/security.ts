import cors from "cors";
import { Application } from "express";

export const RegisterSecurityMiddleware = (app: Application) => {
    app.use(cors());

    //TODO: rate limit?
};