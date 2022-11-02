import { Application } from "express";
import swaggerUi from "swagger-ui-express";

export const RegisterDocs = (app: Application) => {
    const specs = { swaggerOptions: { url: "/swagger.gen.json" } };
    app.use("/", swaggerUi.serve, swaggerUi.setup(undefined, specs));   
};