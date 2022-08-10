import Logger from "../src/logger";

describe("Logger", () => {
    it("Test", () =>{
        const logger = new Logger();
        logger.requestDidStart();
    });
});