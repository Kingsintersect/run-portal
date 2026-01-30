// app/lib/cookies.ts

import { loginSessionKey } from './definitions';
import { verifySession } from './server.utils';

// Server-side imports (won't be bundled for client)
let serverCookies: any = null;

// Dynamic import for server-side only
if (typeof window === 'undefined') {
    import('next/headers').then(module => {
        serverCookies = module.cookies;
    });
}

export class CookieManager {
    static isHttpOnlyCookie(name: string): boolean {
        // If we can see the cookie in DevTools but not in document.cookie, it's HTTP-only
        // Note: This requires manual checking in DevTools
        console.log('Cannot programmatically detect HttpOnly cookies. Please check in browser DevTools.', name);
        return false; // We can't detect this programmatically
    }

    static get(name: string): string | null {
        // Server-side: Use next/headers
        if (typeof window === 'undefined') {
            try {
                const cookieStore = serverCookies();
                return cookieStore.get(name)?.value || null;
            } catch (error) {
                console.error('Error getting server cookie:', error);
                return null;
            }
        }

        // Client-side: Use document.cookie
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [cookieName, ...cookieValueParts] = cookie.trim().split('=');
            if (cookieName === name) {
                return cookieValueParts.join('=');
            }
        }
        return null;
    }

    static async getAccessToken(): Promise<string | null> {
        // Since we cannot access HTTP-only cookies from JavaScript,
        // we assume the server handles authentication via these cookies.
        const session = await verifySession(loginSessionKey);
        return session?.access_token || null;
    }

    static getSessionToken(cookieName: string = 'run_session'): string | null {
        const cookieValue = this.get(cookieName);

        if (!cookieValue) {
            // Try other common session cookie names
            const sessionCookies = ['session', 'auth_session', 'user_session', 'token'];
            for (const name of sessionCookies) {
                const token = this.get(name);
                if (token) return this.parseTokenValue(token);
            }
            return null;
        }

        return this.parseTokenValue(cookieValue);
    }

    private static parseTokenValue(value: string): string {
        try {
            // Try to parse as JSON
            const decoded = decodeURIComponent(value);
            const parsed = JSON.parse(decoded);
            return parsed.accessToken || parsed.token || value;
        } catch {
            // If not JSON, return raw value
            return value;
        }
    }

    static getAll(): Record<string, string> {
        if (typeof window === 'undefined') {
            // Server-side
            try {
                const cookieStore = serverCookies();
                const allCookies: Record<string, string> = {};
                cookieStore.getAll().forEach(cookie => {
                    allCookies[cookie.name] = cookie.value;
                });
                return allCookies;
            } catch (error) {
                console.error('Error getting all server cookies:', error);
                return {};
            }
        }

        // Client-side
        const cookies: Record<string, string> = {};
        document.cookie.split(';').forEach(cookie => {
            const [name, ...valueParts] = cookie.trim().split('=');
            if (name) {
                cookies[name] = valueParts.join('=');
            }
        });
        return cookies;
    }
}