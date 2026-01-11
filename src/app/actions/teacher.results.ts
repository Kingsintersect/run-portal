import { remoteApiUrl } from "@/config";
import { apiCallerBeta } from "@/lib/apiCaller";

// interface ApiResponse<T> {
//     success: boolean;
//     data?: T;
//     error?: string;
// }

// result system
export const fetchStudentsResults = async (access_token: string) => {
    const response = (await apiCallerBeta({
        url: `${remoteApiUrl}/teacher/students-results`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    }))
    if (response.error) {
        throw new Error(response.error.toString() || "Failed to fetch students results");
    }
    return response.success;
}
export const fetchTeacherCourses = async (access_token: string) => {
    const res = await fetch(`${remoteApiUrl}/courses`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
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

export const fetchStudentScores = async (courseId: string | number, access_token: string) => {
    const response = (await apiCallerBeta({
        url: `${remoteApiUrl}/teacher/course/course-gradings/${courseId}`,
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

export const ExportScores = async (courseId: string | number, access_token: string) => {
    const res = await fetch(`${remoteApiUrl}/admin/course/process-gradings/${courseId}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch students");
    }
    const result = await res.json();
    return result.data;
}