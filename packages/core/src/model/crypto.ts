export interface ICryptoAddressRequest {
    currency: string;
    link: string;
    name: string;
    message: string;
    challenge: string;
    challengeResponse: string;
}

export interface ICryptoAddressResponse {
    address: string;
}

export interface ICryptoChallengeResponse {
    challenge: string;
}

export interface ICryptoTokensResponse {
    tokens: Array<ICryptoTokenResponse>;
}

export interface ICryptoTokenResponse {
    currency: string;
    color: string;
    icon: string;
}