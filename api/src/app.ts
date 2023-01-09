import express, { Application } from "express";
import mongoose from "mongoose";
import { RegisterRoutes } from "./modules/routes.gen";
import { RegisterLogger } from "./modules/log";
import { RegisterRequestParser } from "./modules/request";
import { RegisterErrorCatcher } from "./modules/error";
import { RegisterDocs } from "./modules/docs";
import { RegisterSecurityMiddleware } from "./modules/security";

await mongoose.connect(process.env.MONGO_URL ?? "");
const app: Application = express();
const middlewares = [
    RegisterLogger, 
    RegisterRequestParser, 
    RegisterSecurityMiddleware, 
    RegisterRoutes,
    RegisterDocs,
    RegisterErrorCatcher
];
middlewares.forEach(x => x(app));
app.listen(process.env.PORT);