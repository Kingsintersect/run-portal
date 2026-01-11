import { remoteApiUrl } from "@/config";
import { GPACourse, GPAGradeReport } from "@/lib/gpa.utils";

interface ApiResponse {
	status: number;
	data: Array<{
		course_id: number;
		course_name: string;
		course_code: string;
		credit_load: number;
		reg_number: number;
		finalgrade: string | null;
		activities: any[];
	}>;
}

export async function getStudentGradeReport(
	email: string,
	access_token: string
): Promise<GPAGradeReport> {
	try {
		const response = await fetch(
			`${remoteApiUrl}/admin/course/grading?student_email=${email}`,
			{
				cache: "no-store",
				method: "GET",
				headers: {
					Authorization: `Bearer ${access_token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			console.error(`Failed to fetch: ${response.status}`);
			return [] as any;
		}

		const apiResponse: ApiResponse = await response.json();
		const coursesData = apiResponse.data;

		const transformedCourses: GPACourse[] = coursesData.map((course) => ({
			course_id: course.course_id.toString(),
			course_code: course.course_code,
			course_name: course.course_name.replace(
				course.course_code + " - ",
				""
			),
			credit_load: course.credit_load ?? 0, //CHANGE THE 2 TO 0 AFTER TESTING
			grade: "A",
			finalgrade: course.finalgrade || 0,
			activities: course.activities,
		}));

		const gradeReport: GPAGradeReport = {
			courses: transformedCourses,
			semester: "First",
			academicYear: "2024-2025",
		};
		return gradeReport;
	} catch (error) {
		console.error("Error fetching student grade report:", error);
		throw error;
	}
}
