import { PingController } from "../../../src/controllers/v1/ping.js";

it("Ping should return pong",  async () => {
    const controller = new PingController();
    const response = await controller.getMessage();
    expect(response).toStrictEqual({ message: "pong" });
});