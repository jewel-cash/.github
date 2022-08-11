import express from "express";
import swaggerUi from "swagger-ui-express";

const router = express.Router();

const specs = { 
    swaggerOptions: 
    { 
        url: "/swagger.json"
    }
};

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(undefined, specs));

export default router;