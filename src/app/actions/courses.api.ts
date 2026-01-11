import { remoteApiUrl } from "@/config";
import { apiCallerBeta } from "@/lib/apiCaller";

export async function GetCoursesInAProgram(
	access_token: string,
	programe: string,
	departmentId: string
) {
	const response = (await apiCallerBeta({
		url: `${remoteApiUrl}/admin/course-assignment/program-courses?department_id=${departmentId}&program=${programe}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})) as any;
	return response;
}
