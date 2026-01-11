import { remoteApiUrl } from "@/config";
import { apiCallerBeta } from "@/lib/apiCaller";
import { ObjectType } from "@/types/generic.types";
import { StudentFormData } from "../(dashboard)/dashboard/admin/users/create/new/student.validation";

export async function fetchAllStudentApplications(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/all-applications?startTerm=2024/2025`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;

	return response;
}

export async function fetchSingleStudentApplications(
	access_token: string,
	id: string
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/single-application?id=${id}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function ApproveStudentAdmission(
	access_token: string,
	data: ObjectType
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/approve-application`,
		method: "POST",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function RejectStudentAdmission(
	access_token: string,
	data: ObjectType
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/reject-application`,
		method: "DELETE",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetAmissionApprovedStudentList(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/approved-applicants`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetAmissionRejectedStudentList(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/rejected-applicants`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetAppliedStudentList(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/applied-students`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetUnappliedStudentList(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/unapplied-students`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}
export async function updateStudentStatusField(
	data: Record<string, string>,
	access_token: string
): Promise<ApiResponse<any>> {
	const response = await fetch(`${remoteApiUrl}/account/user-update`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${access_token}`,
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || `Failed with status ${response.status}`);
	}

	const resData = await response.json();
	return { success: true, data: resData };
}

export type FormData<T> = {
	[K in keyof T]: T[K];
};
export const adminCreateNewStudent = async (
	data: StudentFormData,
	access_token: string
): Promise<{ success: boolean; message: string; data: ObjectType }> => {
	const response = await fetch(`${remoteApiUrl}/account/create-student`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${access_token}`,
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || `Failed with status ${response.status}`);
	}

	const responseData = await response.json();
	return {
		success: true,
		message: responseData.message || "Student added successfully",
		data: responseData,
	};
};


// result system
export const fetchLmsCourses = async (access_token: string, short_code: string) => {
	const res = await fetch(`${remoteApiUrl}/odl/cohorts-and-categories-and-courses`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${access_token}`,
		},
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.message || "Failed to fetch students");
	}
	const result = await res.json();
	return result.filter(
		c => c.cohort_name.trim() === short_code
	);
};

export const fetchStudentScores = async (courseId: string | number, access_token: string) => {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course/course-gradings/${courseId}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	}))
	if (response.error) {
		throw new Error(response.error.toString() || "Failed to fetch students");
	}
	if (typeof response.success === "object" && response.success !== null && "data" in response.success) {
		return (response.success as { data }).data;
	}
	return response.success;
};

export const publishScores = async (courseId: string | number, access_token: string) => {
	const res = await fetch(`${remoteApiUrl}/admin/course/process-gradings/${courseId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${access_token}`,
		},
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.message || "Failed to fetch students");
	}
	const result = await res.json();
	return result.data;
};