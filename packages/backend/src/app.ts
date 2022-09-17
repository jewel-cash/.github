import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import cors from "cors";
import { RegisterRoutes } from "./modules/routes.gen.js";
import { RegisterCronsJobs } from "./modules/cron.js";
import { HttpError } from "./modules/error.js";

const options: mongoose.ConnectOptions = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
};

await mongoose.connect(process.env.MONGO_URL ?? "", options);

const app: Application = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));
app.use(cors());

RegisterCronsJobs(app);
RegisterRoutes(app);

const specs = { swaggerOptions: { url: "/swagger.gen.json" } };
app.get("/", swaggerUi.serve, swaggerUi.setup(undefined, specs));

app.use((req: Request) => {
    throw new HttpError(404, `"${req.url}" is not found.`);
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status || 500).send(err.message);
});

app.listen(process.env.PORT);