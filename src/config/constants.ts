import { env, getApiHost } from "../lib/utils";

// APPLICATION BASE URLS
export const baseUrl = env("NEXT_PUBLIC_BASE_URL", "");
export const apiUrl = (env("NEXT_PUBLIC_BASE_URL", "")) + "/api";

export const remoteApiUrl = (process.env.NEXT_PUBLIC_API_DOMAIN ?? "") + "/api/v1";
export const ROOT_IMAGE_URL = (process.env.NEXT_PUBLIC_API_DOMAIN ?? "") + "/storage/";
export const remoteApiHost = getApiHost(process.env.NEXT_PUBLIC_API_DOMAIN);
export const lmsLoginUrl = process.env.NEXT_PUBLIC_LMS_LOGIN_URL ?? "";

// PAYMENT GATEWAY CONFIG
export const credoPaymentBaseUrl = process.env.NEXT_PUBLIC_CREDO_PAYMENT_GATEWAY_URL ?? "https://pay.credodemo.com/v4";


// APPLICATION BASE CONFIG
export const SITE_SHORT_NAME = process.env.NEXT_PUBLIC_APP_SHORT_NAME ?? "";
export const SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "";
export const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE ?? "";

// COOKIE AND SESSION CONFIG
export const ssoSessionKey = process.env.NEXT_PUBLIC_SSO_SESSION_KEY ?? "";
export const loginSessionKey = process.env.NEXT_PUBLIC_LOGIN_SESSION_KEY ?? "";
export const appSessionKey = process.env.NEXT_PUBLIC_APP_SESSION_KEY ?? "";
export const sessionSecret = process.env.NEXT_PUBLIC_SESSION_SECRET ?? "";
export const sessionPassword =
	process.env.NEXT_PUBLIC_SESSION_PASSWORD ?? "";

// TOKENS CONFIG
export const accessTokenSecret =
	process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET ?? "";
export const refreshTokenSecret =
	process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET ?? "";


// JWT CONFIGS
export const clientId = process.env.NEXT_PUBLIC_CLIENT_ID ?? "";
export const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET ?? "";

const secretKey = process.env.NEXT_PUBLIC_SESSION_SECRET;
export const encodedKey = new TextEncoder().encode(secretKey);
export type PaymentStatus = "FULLY_PAID" | "PART_PAID" | "UNPAID" | null;

export type SessionPayload<T = Record<string, unknown>> = T & {
	issuedAt?: number;
	expiresAt: number;
};

export enum Roles {
	ADMIN = "ADMIN",
	STUDENT = "STUDENT",
	TEACHER = "TEACHER",
	MANAGER = "MANAGER",
}

// configuration for admission application form
export enum ProgramType {
	ODL = "odl",
	BUSINESS_SCHOOL = "business_school",
}
export const SelectedProgramType: ProgramType = ProgramType.ODL;

export const APPLICATION_FEE = 10000;
export const ACCEPTANCE_FEE = 30000;
export const FULL_TUITION_FEE = 195000;
