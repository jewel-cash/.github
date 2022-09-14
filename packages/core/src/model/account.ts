export interface IAccountStatus {
    onboarded: boolean;
}

export interface IAccountLinksResponse {
    links: Array<IAccountLinkResponse>;
}

export interface IAccountLinkResponse {
    link: string;
}

export interface IAccountStripeLinkRequest {
    refresh: string;
    redirect: string;
}

export interface IAccountStripeLinkResponse {
    redirect: string;
    expires: number;
}