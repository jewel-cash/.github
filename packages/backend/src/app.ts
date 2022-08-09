import express, { Application } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import indexRouter from "./routes/index.js";
import docsRouter from "./routes/docs.js";
import dotenv from "dotenv";

dotenv.config();
const app: Application = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));

app.use("/", indexRouter);
app.use("/docs", docsRouter);

app.use((_, res) => {
    res.status(404).send("404 - Not Found");
});

app.listen(process.env.PORT);