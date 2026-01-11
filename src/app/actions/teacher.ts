'use client'

import { remoteApiUrl } from "@/config";
import { apiCallerBeta } from "@/lib/apiCaller";
import { ApiResponse } from "@/types/generic.types";

export async function GetTotalStudentList(access_token: string) {
  const response = (await apiCallerBeta({
    url: `${remoteApiUrl}/teacher/total-students`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })) as any;
  return response;
}

export async function GetTotalCoursesList(access_token: string) {
  const response = (await apiCallerBeta({
    url: `${remoteApiUrl}/teacher/courses`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })) as any;
  return response;
}

export async function ViewSingleCourse(
  access_token: string,
  courseId: string
): Promise<ApiResponse<{ shouldRedirect: boolean }>> {
  try {
    const response = await apiCallerBeta({
      url: `${remoteApiUrl}/admin/course/course-gradings/${courseId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.error) {
      return {
        success: null,
        error: "Failed to fetch course",
      };
    }

    return {
      success: { shouldRedirect: true }, // ✅ CORRECT TYPE
      error: null,
    };
  } catch (error: any) {
    return {
      success: null,
      error: error?.message ?? "Unexpected error occurred",
    };
  }
}
// export async function GetCourseDetails(
//   access_token: string,
//   courseId: string
// ): Promise<ApiResponse<{ course: any; students: any[] }>> {
//   try {
//     const response = await apiCallerBeta({
//       url: `${remoteApiUrl}/teacher/courses/${courseId}`,
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     });

//     if (response.error) {
//       return {
//         success: false,
//         error: response.error.message || 'Failed to fetch course details'
//       };
//     }

//     return {
//       success: {
//         course: response.data.course,
//         students: response.data.students
//       },
//       error: null
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: 'An error occurred while fetching course details'
//     };
//   }
// }