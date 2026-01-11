import { remoteApiUrl } from "@/config";
import { apiCallerBeta } from "@/lib/apiCaller";
import { ObjectType } from "@/types/generic.types";

export async function FetchAllUsers(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/account/allusers`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function FetchAllTeachers(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/account/allteachers`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function FetchAllStudents(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/account/allstudents`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function FetchAllManagers(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/account/allmanagers`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function FetchSigleUser(access_token: string, id: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/account/user/${id}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetRoles(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/account/getroles`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function UpdateUserRole(
	access_token: string,
	id: string,
	data: ObjectType
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/account/user/${id}`,
		method: "PUT",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}
