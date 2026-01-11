export interface SessionData {
	expiresAt: number;
	[key: string]: any;
}
export interface LoginSession {
	user: any;
	access_token: string;
}
export interface SSOAuthSession {
	authCode: string;
	clientId: string;
	expiresAt: number;
}
