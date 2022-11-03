import express, { Application } from "express";
import mongoose from "mongoose";
import { RegisterRoutes } from "./modules/routes.gen.js";
import { RegisterCronsJobs } from "./modules/cron.js";
import { RegisterLogger } from "./modules/log.js";
import { RegisterRequestParser } from "./modules/request.js";
import { RegisterErrorCatcher } from "./modules/error.js";
import { RegisterDocs } from "./modules/docs.js";
import { RegisterSecurityMiddleware } from "./modules/security.js";

await mongoose.connect(process.env.MONGO_URL ?? "");
const app: Application = express();
const middlewares = [
    RegisterLogger, 
    RegisterRequestParser, 
    RegisterSecurityMiddleware, 
    RegisterCronsJobs, 
    RegisterRoutes,
    RegisterDocs,
    RegisterErrorCatcher
];
middlewares.forEach(x => x(app));
app.listen(process.env.PORT);