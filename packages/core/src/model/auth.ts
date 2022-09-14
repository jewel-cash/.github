export interface IAuthKeyResponse {
    id: string;
    name: string;
    expires: number;
}

export interface IAuthKeysResponse {
    keys: Array<IAuthKeyResponse>;
}

export interface IAuthCreateKeyRequest {
    name: string;
}

export interface IAuthCreateKeyResponse {
    payload: IAuthKeyResponse;
    key: string;
}