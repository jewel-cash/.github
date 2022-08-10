import createError from "http-errors";
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

app.use((req, res, next) => {
    next(createError(404));
});

// app.use((err, req, res, next) => {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get("env") === "development" ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render("error");
// });

app.listen(process.env.PORT);