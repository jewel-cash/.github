/* eslint-disable @typescript-eslint/no-empty-function */

interface Isomorphic {
    fetch: (url: string, req: object) => Promise<object>;
    sha256Hmac: (message: string, secret: string) => string;
}

const isomorphic: Isomorphic = {
    fetch: async () => Promise.resolve(new Response()),
    sha256Hmac: (message, _) => message
};

export default isomorphic;
