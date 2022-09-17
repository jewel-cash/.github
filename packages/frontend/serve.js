import handler from "serve-handler";
import { createServer } from "http";

const server = createServer((request, response) => {
    return handler(request, response, { public: "./build" });
});

server.listen(process.env.PORT);