import { remoteApiUrl } from "@/config";
import { CLassSubject, Country, Course, CourseAssignment, CourseCategory, Department, Faculty, LocalGov, State, SubjectGrade } from "@/config/Types";
import { apiCallerBeta } from "@/lib/apiCaller";
import { ApiResponse } from "@/types/generic.types";

export async function GetAllActiveFaculties() {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/faculties/active`,
		method: "GET",
	})) as any;
	response.revalidate = 60;
	return response;
}

export async function GetAllActiveFacultiesWithDepartments() {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/active-faculties/depts`,
		method: "GET",
	})) as any;
	response.revalidate = 60;
	return response;
}
// const fetchFacultyAndDepartments = async () => {
// 	let facDept: any[] = [];
// 	const { error, success }: any = await GetListOfFaculties();
// 	if (success?.data) {
// 		for (const faculty of success.data) {
// 			const { error, success }: any = await GetAllDepartmentInAFaculty(
// 				faculty.id
// 			);
// 			if (success?.data) {
// 				faculty.departments = success.data;
// 				facDept.push(faculty);
// 			}
// 		}
// 	}
// 	return facDept;
// };

export async function GetListOfFaculties() {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/faculties`,
		method: "GET",
	})) as any;
	response.revalidate = 60;
	return response;
}

export async function GetSingleFaculty(access_token: string, id: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/faculty?faculty_id=${id}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function CreateNewFaculty(
	access_token: string,
	data: Omit<Faculty, "id">
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/faculty/create-faculty`,
		method: "POST",
		data: {
			...data,
			...(data.description === null
				? {}
				: { description: data.description }),
		},
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function UpdateSingleFaculty(
	id: string,
	access_token: string,
	data: Partial<Faculty>
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/faculty/update-faculty?faculty_id=${id}`,
		method: "PATCH",
		data: {
			...data,
			...(data.description === null
				? {}
				: { description: data.description }),
		},
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function DeleteSingleFaculty(access_token: string, id: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/faculty/delete-faculty?faculty_id=${id}`,
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetListOfDepartments() {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/departments`,
		method: "GET",
	})) as any;
	return response;
}

export async function GetAllDepartmentInAFaculty(id: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/faculty-departments?faculty_id=${id}`,
		method: "GET",
	})) as any;
	return response;
}

export async function GetSingleDepartment(id: string, access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/department?department_id=${id}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function CreateNewDepartment(
	access_token: string,
	data: Omit<Department, "id">
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/department/create-department`,
		method: "POST",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function UpdateSingleDepartment(
	id: string,
	access_token: string,
	data: Partial<Department>
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/department/update-department?department_id=${id}`,
		method: "PATCH",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function DeleteSingleDepartment(access_token: string, id: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/department/delete-department?department_id=${id}`,
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

// COUSES API CRUD ENDPOINTS
export async function GetListOfCourses(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/courses`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetSingleCourse(id: string, access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/course?course_id=${id}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetStudentCourses(
	access_token: string,
	userId: string | number,
	short_code: string
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-assignment/student-courses?student_id=${userId}&level=${short_code}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function UpdateSingleCourse(
	id: string,
	access_token: string,
	data: Partial<Course>
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course/update-course?course_id=${id}`,
		method: "PUT",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function CreateNewCourse(
	access_token: string,
	data: Omit<Course, "id">
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course/create-course`,
		method: "POST",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function DeleteSingleCourse(access_token: string, id: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course/delete-course?course_id=${id}`,
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

// COURSES CATEGORIES API CRUD ENDPOINTS
export async function GetListOfCourseCategories(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/course-categories`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetSingleCourseCategory(
	id: string,
	access_token: string
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/course-category?course_category_id=${id}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function UpdateSingleCourseCategory(
	id: string,
	access_token: string,
	data: Partial<CourseCategory>
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-category/update-course-category?course_category_id=${id}`,
		method: "PUT",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function CreateNewCourseCategory(
	access_token: string,
	data: Omit<CourseCategory, "id" | "short_code">
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-category/create-course-category`,
		method: "POST",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function DeleteSingleCourseCategory(
	access_token: string,
	id: string
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-category/delete-course-category?course_category_id=${id}`,
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

// COURSES ASSINGMENT API CRUD ENDPOINTS
export async function GetAllCourseAssignment(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-assignment/all`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetCoursesAssignedToACategory(
	id: string,
	access_token: string
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-assignment/get-courses?course_category_id=${id}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function UpdateSingleCourseAssignment(
	id: string,
	access_token: string,
	data: Partial<CourseAssignment>
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-category/update-course-category?course_category_id=${id}`,
		method: "PUT",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function CreateNewCourseAssignment(
	access_token: string,
	data: Omit<CourseAssignment, "id">
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-assignment/create`,
		method: "POST",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetAllCoursesInACategory(
	short_code: string,
	access_token: string
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/course-enrolment/courses?level=${short_code}&semester=2SM`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function DeleteSingleCourseAssignment(
	access_token: string,
	id: string
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-category/delete-course-category?course_category_id=${id}`,
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function DeleteSingleAssignment(
	access_token: string,
	courseCategoryId: number,
	courseId: number,
	creditLoad: number
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-assignment/delete?course_category_id=${courseCategoryId}&course_id=${courseId}&credite_load=${creditLoad}`,
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

// COUNTRY API CRUD ENDPOINTS
export async function GetListOfCountries() {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/reject-application`,
		method: "GET",
	})) as any;
	return response;
}

export async function GetSingleCountry(id: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/reject-application`,
		method: "GET",
	})) as any;
	return response;
}

export async function UpdateSingleCountry(
	access_token: string,
	data: Partial<Country>
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/reject-application`,
		method: "POST",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function CreateNewCountry(
	access_token: string,
	data: Omit<Country, "id">
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/reject-application`,
		method: "POST",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function DeleteSingleCountry<T>(
	access_token: string,
	id: string
): Promise<ApiResponse<T>> {
	const response = await apiCallerBeta<T>({
		url: `${remoteApiUrl}/admin/reject-application`,
		method: "POST",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
	return response;
}

// STATE API CRUD ENDPOINTS
export async function GetListOfStates(access_token: string | null) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/state/all-states`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetSingleState(id: string, access_token: string) {
	let response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/state/all-states`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	if (response.success.data) {
		const state = response.success.data.find(
			(state: any) => state.id === Number(id)
		);
		response = { error: null, success: { data: state } };
	}
	return response;
}

export async function UpdateSingleState(
	id: string,
	access_token: string,
	data: Partial<State>
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/state/update-state?id=${id}`,
		method: "PUT",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function CreateNewState(
	access_token: string,
	data: Omit<State, "id">
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/state/add-state`,
		method: "POST",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function DeleteSingleState(access_token: string, id: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/state/delete-state?id=${id}`,
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

// LOCAL GOV. API CRUD ENDPOINTS
export async function GetListOfLocalGov(access_token: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/lga/all-lga`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetListOfLocalGovInState(
	stateId: string,
	access_token?: string
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/lga/all-lga?state_id=${stateId}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function GetSingleLocalGov(
	id: string,
	parentId: string,
	access_token: string
) {
	let response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/lga/all-lga?state_id=${parentId}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	if (response.success.data) {
		const lga = response.success.data.find(
			(lga: any) => lga.id === Number(id)
		);
		response = { error: null, success: { data: lga } };
	}
	return response;
}

export async function UpdateSingleLocalGov(
	id: string,
	access_token: string,
	data: Partial<LocalGov>
) {
	data.lga = data.name;
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/lga/update-lga?id=${id}`,
		method: "PUT",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function CreateNewLocalGov(
	access_token: string,
	data: Omit<LocalGov, "id">
) {
	data.lgas = data.lga.split(",");
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/lga/add-lga`,
		method: "POST",
		data: { ...data },
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

export async function DeleteSingleLocalGov(access_token: string, id: string) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/lga/delete-lga?id=${id}`,
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}

// CLASS SUBJECT API CRUD ENDPOINTS
export async function GetListOfClassSubjects() {
	// const response = await apiCallerBeta({
	//    url: `${remoteApiUrl}/admin/reject-application`,
	//    method: 'GET',
	//    headers: {
	//       Authorization: `Bearer ${access_token}`,
	//
	//    }
	// }) as any;
	// return response;
	return {
		error: null,
		success: [
			{
				id: "1",
				name: "English",
			},
			{
				id: "2",
				name: "Mathematics",
			},
			{
				id: "3",
				name: "Physics",
			},
		],
	};
}

export async function GetSingleClassSubjects(id: string) {
	// const response = await apiCallerBeta({
	//    url: `${remoteApiUrl}/admin/reject-application`,
	//    method: 'GET',
	//    headers: {
	//       Authorization: `Bearer ${access_token}`,
	//
	//    }
	// }) as any;
	// return response;
	return {
		error: null,
		success: {
			classSubjects: {
				id: "1",
				name: "English",
			},
		},
	};
}

export async function UpdateSingleClassSubjects(
	access_token: string,
	data: Partial<CLassSubject>
) {
	// const response = await apiCallerBeta({
	//    url: `${remoteApiUrl}/admin/reject-application`,
	//    method: 'POST',
	// data: { ...data },
	//    headers: {
	//       Authorization: `Bearer ${access_token}`,
	//
	//    }
	// }) as any;
	// return response;
	return {
		error: null,
		success: {
			classSubjects: {
				id: "1",
				name: "English",
			},
		},
	};
}

export async function CreateNewClassSubjects(
	access_token: string,
	data: Omit<CLassSubject, "id">
) {
	// const response = await apiCallerBeta({
	//    url: `${remoteApiUrl}/admin/reject-application`,
	//    method: 'POST',
	// data: { ...data },
	//    headers: {
	//       Authorization: `Bearer ${access_token}`,
	//
	//    }
	// }) as any;
	// return response;
	return {
		error: null,
		success: {
			classSubjects: {
				id: "1",
				name: "English",
			},
		},
	};
}

export async function DeleteSingleClassSubjects(
	access_token: string,
	id: string
) {
	// const response = await apiCallerBeta({
	//    url: `${remoteApiUrl}/admin/reject-application`,
	//    method: 'POST',
	// data: { ...data },
	//    headers: {
	//       Authorization: `Bearer ${access_token}`,
	//
	//    }
	// }) as any;
	// return response;
	return {
		error: null,
		success: {
			classSubjects: {
				id: "1",
				name: "English",
			},
		},
	};
}

// SUBJECT GRADE  API CRUD ENDPOINTS
export async function GetListOfSubjectGrade() {
	// const response = await apiCallerBeta({
	//    url: `${remoteApiUrl}/admin/reject-application`,
	//    method: 'GET',
	//    headers: {
	//       Authorization: `Bearer ${access_token}`,
	//
	//    }
	// }) as any;
	// return response;
	return {
		error: null,
		success: [
			{
				id: "1",
				name: "A1",
			},
			{
				id: "2",
				name: "B2",
			},
			{
				id: "3",
				name: "C4",
			},
		],
	};
}

export async function GetSingleSubjectGrade(id: string) {
	// const response = await apiCallerBeta({
	//    url: `${remoteApiUrl}/admin/reject-application`,
	//    method: 'GET',
	//    headers: {
	//       Authorization: `Bearer ${access_token}`,
	//
	//    }
	// }) as any;
	// return response;
	return {
		error: null,
		success: {
			grade: {
				id: "1",
				name: "A1",
			},
		},
	};
}

export async function UpdateSingleSubjectGrade(
	access_token: string,
	data: Partial<SubjectGrade>
) {
	// const response = await apiCallerBeta({
	//    url: `${remoteApiUrl}/admin/reject-application`,
	//    method: 'POST',
	// data: { ...data },
	//    headers: {
	//       Authorization: `Bearer ${access_token}`,
	//
	//    }
	// }) as any;
	// return response;
	return {
		error: null,
		success: {
			grade: {
				id: "1",
				name: "A1",
			},
		},
	};
}

export async function CreateNewSubjectGrade(
	access_token: string,
	data: Omit<SubjectGrade, "id">
) {
	// const response = await apiCallerBeta({
	//    url: `${remoteApiUrl}/admin/reject-application`,
	//    method: 'POST',
	// data: { ...data },
	//    headers: {
	//       Authorization: `Bearer ${access_token}`,
	//
	//    }
	// }) as any;
	// return response;
	return {
		error: null,
		success: {
			grade: {
				id: "1",
				name: "A1",
			},
		},
	};
}

export async function DeleteSingleSubjectGrade(
	access_token: string,
	id: string
) {
	// const response = await apiCallerBeta({
	//    url: `${remoteApiUrl}/admin/reject-application`,
	//    method: 'POST',
	// data: { ...data },
	//    headers: {
	//       Authorization: `Bearer ${access_token}`,
	//
	//    }
	// }) as any;
	// return response;
	return {
		error: null,
		success: {
			grade: {
				id: "1",
				name: "A1",
			},
		},
	};
}
