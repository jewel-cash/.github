import express from "express";
import PingController from "../controllers/ping.js";

const router = express.Router();

router.get("/ping", async (req, res) => {
    const controller = new PingController();
    const response = await controller.getMessage();
    return res.send(response);
});

export default router;