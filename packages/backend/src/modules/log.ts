import { Application } from "express";
import morgan from "morgan";

export const RegisterLogger = (app: Application) => {
    app.use(morgan("tiny"));
};