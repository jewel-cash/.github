import { Client } from "jewel-core";

const baseUrl = process.env.REACT_APP_SERVER_URL ?? "";

const staticHeaders = {
    "Content-Type": "application/json"
};
const fetch = window.fetch.bind(window);

//TODO: remove export when implemented
export const client = new Client(baseUrl, fetch, staticHeaders);

