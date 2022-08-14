import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import { RegisterRoutes } from "./modules/routes.gen.js";

dotenv.config();

const options: mongoose.ConnectOptions = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
};

await mongoose.connect("mongodb://127.0.0.1:27017/test", options);

const app: Application = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));

RegisterRoutes(app);

const specs = { swaggerOptions: { url: "/swagger.gen.json" } };
app.get("/", swaggerUi.serve, swaggerUi.setup(undefined, specs));

app.use((_0: Request, _1: Response, next: NextFunction) => {
    next({ status: 404, message: "Not Found"});
});

app.use((err: any, _0: Request, res: Response) => {
    res.status(err.status || 500).send(err.message);
});

app.listen(process.env.PORT);