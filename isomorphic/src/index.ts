/* eslint-disable @typescript-eslint/no-empty-function */

interface Isomorphic {
    fetch: (url: string, req: any) => any;
    sha256Hmac: (message: string, secret: string) => string;
}

const isomorphic: Isomorphic = { 
    fetch: () => { },
    sha256Hmac: (message, _ ) => message
};

export default isomorphic;