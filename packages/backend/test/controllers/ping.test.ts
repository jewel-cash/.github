import PingController from "../../src/controllers/ping";

it("Ping should return pong",  async () => {
    const controller = new PingController();
    const response = await controller.getMessage();
    expect(response.message).toBe("pong");
});