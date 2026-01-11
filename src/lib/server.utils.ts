import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { SessionData } from "@/types/auth";

export async function verifySession(key?: string) {
	try {
		const loginSession = (await getSession(key || "")) as SessionData;
		if (!loginSession) {
			redirect("/auth/signin");
		}
		return loginSession;
	} catch (error) {
		console.error("Session verification failed", error);
		redirect("/auth/signin");
	}
}

export async function SessionExists(key?: string) {
	try {
		const loginSession = (await getSession(key || "")) as SessionData;
		if (!loginSession) {
			return null;
		}
		return loginSession;
	} catch {
		return null;
	}
}
