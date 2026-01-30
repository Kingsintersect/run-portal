import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "./definitions";
import { cookies } from "next/headers";
import { encodedKey } from "@/config";

/**
 * Helper function to calculate access_token expiration time.
 */
export function getExpiryDuration(
    duration: string,
    timezoneOffset: number = 0
): number {
    const match = duration.match(/^(\d+)([smhd]?)$/);
    if (!match)
        throw new Error(
            "Invalid duration format. Use format like '10s', '5m', '2h', or '1d'."
        );

    const value = parseInt(match[1], 10);
    const unit = match[2] || "h"; // Default to hours if no unit is provided

    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
    const timezoneAdjustment = timezoneOffset * 3600; // Convert hours to seconds

    const unitMultipliers: Record<string, number> = {
        s: 1, // Seconds
        m: 60, // Minutes
        h: 3600, // Hours
        d: 86400, // Days
    };

    const multiplier = unitMultipliers[unit] || unitMultipliers["h"];

    return currentTime + timezoneAdjustment + value * multiplier;
}

/**
 * Encrypts session data into a JWT access_token.
 */
export async function encrypt(
    payload: SessionPayload,
    duration: string = "1h"
) {
    const expiry = getExpiryDuration(duration, 1); // Adjust for WAT (UTC+1)

    return new SignJWT({ ...payload, exp: expiry })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiry)
        .sign(encodedKey);
}

/**
 * Decrypts and verifies a JWT access_token.
 */
export async function decrypt(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        console.log("Failed to decrypt session: ", error);
        return null;
    }
}

/**
 * Retrieves the full session from cookies.
 */
export async function getFullSession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("run_session")?.value;
    if (!cookie) {
        console.log("run_session could not be found");
        return null;
    }
    return await decrypt(cookie);
}

/**
 * Retrieves a specific session key.
 */
export async function getSession<T = Record<string, any>>(key: string) {
    const allSession = await getFullSession();
    if (!allSession || !allSession[key]) {
        console.log(`${key} could not be found!`);
        return null;
    }

    return allSession[key];
}

/**
 * Sets a session cookie with the given key, value, and expiration duration.
 */
export async function setSession(
    key: string,
    value: any,
    duration: string = "1h"
) {
    const allSession = (await getFullSession()) || {};
    const timeRange = getExpiryDuration(duration, 1);
    const expiresAt = new Date(timeRange * 1000); // Convert to milliseconds

    // Store session payload
    const sessionData = await encrypt(
        {
            ...allSession,
            [key]: value,
            expiresAt: timeRange,
        },
        duration
    );

    const cookieStore = await cookies();
    cookieStore.set("run_session", sessionData, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        // sameSite: "none",
        // domain: ".yourdomain.com", // to maitain the data accross multile sites
        path: "/",
    });
}

export async function updateSessionKey<T extends Record<string, any>>(key: string, newData: Partial<T>) {
    const allSession = await getFullSession();

    if (!allSession || !allSession[key]) {
        console.log(`${key} could not be found!`);
        return;
    }

    const originalExpiry = allSession.expiresAt;

    // Merge new data into the existing key
    allSession[key] = {
        ...allSession[key],
        ...newData,
    };

    // Re-encrypt the updated session with the original expiry
    const sessionData = await encrypt({ ...allSession, expiresAt: originalExpiry as number }, "1h");

    const cookieStore = await cookies();
    cookieStore.set("run_session", sessionData, {
        httpOnly: true,
        secure: true,
        expires: new Date(originalExpiry as number * 1000),
        sameSite: "lax",
        path: "/",
    });
}


export async function deleteSessionKey(key: string) {
    const allSession = await getFullSession();
    if (!allSession || !allSession[key]) {
        console.log(`${key} could not be found!`);
        return;
    }

    // Remove the key from the session object
    delete allSession[key];

    // Re-encrypt the updated session and update the cookie
    const expiresAt = getExpiryDuration("1h"); // Keep the expiration time consistent
    const sessionData = await encrypt({ ...allSession, expiresAt }, "1h");

    const cookieStore = await cookies();
    cookieStore.set("run_session", sessionData, {
        httpOnly: true,
        secure: true,
        expires: new Date(expiresAt * 1000), // Convert Unix timestamp to Date
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();

    // Delete the session cookie by setting an expired date
    cookieStore.set("run_session", "", {
        httpOnly: true,
        secure: true, //process.env.NODE_ENV === 'production'
        expires: new Date(0), // Expire immediately
        sameSite: "lax",
        path: "/",
    });
    cookieStore.delete("session");
}