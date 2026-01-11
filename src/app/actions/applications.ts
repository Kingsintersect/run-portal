"use server";

import { remoteApiUrl } from "@/config";
import { UserInterface } from "@/config/Types";
import { UseDataTableOptions } from "@/hooks/useDataTable";
import { apiCall } from "@/lib/apiCaller";
import { loginSessionKey } from "@/lib/definitions";
import { appendFormData } from "@/lib/formUtils";
import { getSession } from "@/lib/session";
import { ApplicationDetailsType, ApplicationFormData } from "@/schemas/admission-schema";
import { ApplicationApproveValues, ApplicationRejectValues } from "@/schemas/applicationReview-schema";
import { ApiResponseArray, ApiResponseSingle } from "@/types/api.types";
import { Application } from "@/types/application";
import { SessionData } from "@/types/auth";

export async function getAdmissionApplicants(options?: UseDataTableOptions): Promise<{ data: UserInterface[]; total: number }> {
    const loginSession = (await getSession(loginSessionKey)) as SessionData;
    const {
        pageIndex = 0,
        pageSize = 10,
        sortBy = "id",
        sortOrder = "desc",
        search = "",
        filters = {},
        // accademic_session: "",
    } = options ?? {};

    const query = new URLSearchParams({
        page: (pageIndex + 1).toString(),
        limit: pageSize.toString(),
        sortBy,
        sortOrder,
        search,
        // accademic_session: "2024/2025",
        ...filters,
    });

    const response = await apiCall<undefined, ApiResponseArray<UserInterface>>({
        // url: `/admin/all-applications?academicSession=2024/2025&${query.toString()}`,
        url: `/admin/all-applications?${query.toString()}`,
        method: "GET",
        accessToken: loginSession.access_token
    });

    if (response?.status && response.data.data) {
        console.log('response', response.data.data.length);
        return {
            data: response.data.data,
            total: response.data.total,
        };
    } else {
        console.error("Failed to fetch categories");
        return { data: [], total: 0 };
    }
}

export async function getAdmittedApplicants(options?: UseDataTableOptions): Promise<{ data: UserInterface[]; total: number }> {
    const loginSession = (await getSession(loginSessionKey)) as SessionData;
    const {
        pageIndex = 0,
        pageSize = 10,
        sortBy = "id",
        sortOrder = "desc",
        search = "",
        filters = {},
    } = options ?? {};

    const query = new URLSearchParams({
        page: (pageIndex + 1).toString(),
        limit: pageSize.toString(),
        sortBy,
        sortOrder,
        search,
        ...filters,
    });

    const response = await apiCall<undefined, ApiResponseArray<UserInterface>>({
        url: `/admin/approved-applicants?academicSession=2024/2025&${query.toString()}`,
        method: "GET",
        accessToken: loginSession.access_token
    });

    if (response?.status && response.data.data) {
        return {
            data: response.data.data,
            total: response.data.total,
        };
    } else {
        console.error("Failed to fetch categories");
        return { data: [], total: 0 };
    }
}

export async function getStudentApplicantion(id: string): Promise<{ data: ApplicationDetailsType | null }> {
    const loginSession = (await getSession(loginSessionKey)) as SessionData;
    const routeUrl = (loginSession.user.role === "STUDENT")
        ? `/application/application-data`
        : (loginSession.user.role === "ADMIN")
            ? `/admin/single-application?id=${id}`
            : "";

    const response = await apiCall<undefined, ApiResponseSingle<ApplicationDetailsType>>({
        url: `${routeUrl}`,
        method: "GET",
        accessToken: loginSession.access_token
    });

    if (response?.status && response.data) {
        return {
            data: response.data,
        };
    } else {
        console.error("Failed to fetch student application");
        return { data: null };
    }
}

export async function ApproveStudentApplicantion(data: ApplicationApproveValues): Promise<boolean> {
    const loginSession = (await getSession(loginSessionKey)) as SessionData;
    const response = await apiCall<ApplicationApproveValues, ApiResponseSingle<ApplicationDetailsType>>({
        url: `/admin/approve-application`,
        method: "POST",
        data: data,
        accessToken: loginSession.access_token
    });

    if (response?.status !== 200) {
        console.error("Invalid API response", response);
        throw new Error("Failed to approve student application");
    }
    return true;
}

export async function RejectStudentApplicantion(data: ApplicationRejectValues): Promise<boolean> {
    const loginSession = (await getSession(loginSessionKey)) as SessionData;

    const response = await apiCall<ApplicationRejectValues, ApiResponseSingle<ApplicationFormData>>({
        url: `/admin/reject-application`,
        method: "DELETE",
        data: data,
        accessToken: loginSession.access_token
    });
    if (response?.status !== 200) {
        console.error("Invalid API response", response);
        throw new Error("Failed to  reject student applocation");
    }

    return true;
}

// use ApplicationsHook
export async function getApplications(
    filters?: Record<string, string>,
    access_token?: string,
): Promise<Application[]> {
    const params = new URLSearchParams(filters);
    // const res = await fetch(`/api/applications?${params.toString()}`);
    const res = await fetch(`${remoteApiUrl}/admin/all-applications?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch applications");
    }

    return res.json();
}

// review editing
export const updateStudentApplicationData = async (applicationId: string, data: Partial<ApplicationFormData>): Promise<void> => {
    const formData = new FormData();
    formData.append('application_id', applicationId);

    try {
        appendFormData(formData, data as any);
        // seeFormData(formData);
    } catch (error) {
        console.error("FormData preparation failed:", error);
        throw new Error("Failed to prepare form data");
    }
    const loginSession = (await getSession(loginSessionKey)) as SessionData;

    // console.log('FormData contents:');
    // for (const [key, value] of formData.entries()) {
    //     console.log(key, value);
    // }

    const response = await fetch(`${remoteApiUrl}/application/update-application-form`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${loginSession.access_token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('error', error);
        throw new Error(error.message || 'Failed to update personal information');
    }
    const result = await response.json();
    console.log('result', result);
    return result;
};
export const updateStudentPersonalInfoData = async (data: Partial<ApplicationFormData>): Promise<void> => {
    const requestData = { ...data };
    const loginSession = (await getSession(loginSessionKey)) as SessionData;
    // const routeUrl = (loginSession.user.role === "STUDENT")
    //     ? `/account/user-personal-updates`
    //     : (loginSession.user.role === "ADMIN")
    //         ? `/account/user-update`
    //         : "";
    try {
        const response = await fetch(`${remoteApiUrl}/account/user-update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${loginSession.access_token}`,
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} ${errorText}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Network or API error:", error);
        throw new Error("Failed to update personal information. Please try again later.");
    }
};
