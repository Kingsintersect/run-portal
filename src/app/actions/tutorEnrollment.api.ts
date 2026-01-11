import { remoteApiUrl } from "@/config";
import { apiCallerBeta } from "@/lib/apiCaller";
import {
	GetAllActiveFaculties,
	GetAllDepartmentInAFaculty,
} from "./server.admin";
import { GetCoursesInAProgram } from "./courses.api";

export async function EnrollTutorToCourse(
	access_token: string,
	enrollment: Record<string, any>
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-assignment/tutor`,
		method: "POST",
		data: { ...enrollment },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function FetchAllCourseEnrolledByTutor(
	access_token: string,
	tutorId: string
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-assignment/tutor/${tutorId}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function DeleteSingleCourseEnrolledByTutor(
	access_token: string,
	enrollmentId: string,
	tutorId?: string
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-assignment/tutor/${enrollmentId}`,
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

// src/lib/api.ts
export const fetchPrograms = async () => {
	return [
		{ label: "MASTERS", value: "MASTERS" },
		{ label: "PHD", value: "PHD" },
		{ label: "PGDE", value: "PGDE" },
	];
};

export const fetchFaculties = async (program: string) => {
	const { error, success } = await GetAllActiveFaculties();
	if (success) return success.data;
	if (error) console.error("Fetch Faculty Error!", error);
	return [];
};

export const fetchDepartments = async (facultyId: string) => {
	const { error, success } = await GetAllDepartmentInAFaculty(facultyId);
	if (success) return success.data;
	if (error) console.error("Fetch Department Error!", error);
	return [];
};

export const fetchCourses = async (
	access_token: string,
	programe: string,
	departmentId: string
) => {
	const { error, success } = await GetCoursesInAProgram(
		access_token,
		programe,
		departmentId
	);
	if (success) return success.data;
	if (error) console.error("Fetch Department Error!", error);
	return [];
};
