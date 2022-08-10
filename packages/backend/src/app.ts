import express, { Application } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";

import index from "./routes/index.js";
import docs from "./routes/docs.js";
import security from "./middlewares/security.js";
import auth from "./middlewares/auth.js";

dotenv.config();
const app: Application = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));
app.use(security);
app.use(auth);

app.use("/", index);
app.use("/docs", docs);

app.use((_, res) => {
    res.status(404).send("404 - Not Found");
});

app.listen(process.env.PORT);