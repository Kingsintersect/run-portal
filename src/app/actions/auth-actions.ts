"use server";

import { remoteApiUrl } from "@/config";
import { loginSessionKey } from "@/lib/definitions";
import {
	deleteSession,
	deleteSessionKey,
	getSession,
	setSession,
	updateSessionKey,
} from "@/lib/session";
import { apiCallerBeta } from "@/lib/apiCaller";
import { SessionData } from "@/types/auth";
import { ObjectType } from "@/types/generic.types";
import { GenericDataType } from "@/types/generic.types";
import { redirect } from "next/navigation";
import { UserInterface } from "@/config/Types";
import { throwFormattedError } from "@/lib/errorsHandler";
// import { signIn, signOut } from "next-auth/react";
// import { AuthError } from "@auth/core/errors";

export const signinAction = async (
	data: ObjectType
): Promise<GenericDataType> => {
	const { success, error } = (await apiCallerBeta({
		url: `${remoteApiUrl}/application/login`,
		method: "POST",
		data: { ...data },
	})) as GenericDataType;

	if (error) {
		console.error('Sign in error', error)
		return { error };
	}
	const user = success?.user as UserInterface;
	const access_token = success?.access_token as string;
	user.role = user.role ?? "STUDENT";
	await setSession(
		loginSessionKey,
		{
			user: user,
			access_token: access_token,
		},
		"1h"
	);
	return { success: true, user, access_token };
};


export async function signOutAction(platform?: "client" | "server"): Promise<GenericDataType> {
	const loginSession = (await getSession(
		loginSessionKey
	)) as SessionData | null;
	const userRole = loginSession?.user?.role as string | undefined;
	if (loginSession) {
		try {
			await deleteSessionKey(loginSessionKey);
			deleteSession();
			return { success: true, role: userRole };
		} catch (error) {
			console.error(error);
			return { success: false, role: userRole };;
		}
	}
	if (platform === "server") {
		redirect("/auth/signin");
	} else if (platform === "client") {
		return { success: true, role: userRole };
	}
	return { success: true, role: userRole };
}
interface UserResponse {
	user: UserInterface; // UserInterface is the actual user data
	// ... other possible response fields
}
interface ApiResponse<T> {
	error?: {
		message: string;
		// ... other error properties
	};
	success?: T;
}
export const getUser = async (): Promise<ApiResponse<UserResponse>> => {
	const loginSession = (await getSession(loginSessionKey)) as SessionData;

	if (!loginSession) {
		return { error: { message: "No active session" } };
	}

	const res = await apiCallerBeta({
		url: `${remoteApiUrl}/application/profile`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${loginSession.access_token}`,
		},
	});
	return res as ApiResponse<UserResponse>;
};

export async function refetchUserData() {
	let updatedLoginSessionData: SessionData | null = null;
	try {
		updatedLoginSessionData = (await getSession(
			loginSessionKey
		)) as SessionData | null;

		if (!updatedLoginSessionData) {
			return { error: { message: "No active session" }, success: null };
		}

		const { error, success } = await getUser() as ApiResponse<UserResponse>
		if (error) {
			return { error, success: null };
		};

		const newUser = success?.user;
		if (newUser) {
			await updateSessionKey(loginSessionKey, {
				user: {
					...newUser
				}
			});
			updatedLoginSessionData = (await getSession(
				loginSessionKey
			)) as SessionData | null;
		}


		return { success: updatedLoginSessionData, error: null };
	} catch {
		return { error: { message: "Failed to update session" }, success: null };
	}
}

export const ChangeUserPassword = async (
	access_token: string,
	data: ObjectType
) => {
	const response = await apiCallerBeta({
		url: `${remoteApiUrl}/application/change-password`,
		method: "POST",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
		data: { ...data },
	});
	return response;
};

export const CreateUsersByCsv = async (
	access_token: string,
	data: GenericDataType
) => {
	const response = await apiCallerBeta({
		url: `${remoteApiUrl}/account/multi-user-upload`,
		method: "POST",
		data: data,
		headers: {
			Authorization: `Bearer ${access_token}`,
			"Accept": "multipart/form-data",
		},
	});
	return response;
};



// NEXT AUTH IMPEMENTATION
/**
 * 
 * @param data called from the next auth credentials provider
 * @returns 
 */
export const authenticateUser = async (
	data: ObjectType
): Promise<GenericDataType> => {
	const { success, error } = (await apiCallerBeta({
		url: `${remoteApiUrl}/application/login`,
		method: "POST",
		data: { ...data },
	})) as GenericDataType;

	if (error) {
		console.error('Sign in error', error)
		return { error };
	}
	const user = success?.user as UserInterface;
	const access_token = success?.access_token as string;
	user.role = user.role ?? "STUDENT";
	await setSession(
		loginSessionKey,
		{
			user: user,
			access_token: access_token,
		},
		"1h"
	);
	return { success: true, user, access_token };
};
