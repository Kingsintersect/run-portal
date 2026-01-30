export type SessionPayload<T = Record<string, any>> = T & {
	issuedAt?: number;
	expiresAt: number;
};

export const ssoSessionKey = "sso_auth_session_run";
export const loginSessionKey = "login_session_run";
export type PaymentStatus = "FULLY_PAID" | "PART_PAID" | "UNPAID" | null;
