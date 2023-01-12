import isomorphic from "./index.js";
import fetch from "node-fetch";
import { createHmac } from "crypto";

isomorphic.fetch = fetch;
isomorphic.sha256Hmac = (message, secret): string => createHmac("sha245", secret).update(message).digest("hex");

export default isomorphic;
