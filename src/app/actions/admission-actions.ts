"use server";

import { remoteApiUrl } from "@/config";
import { apiCall } from "@/lib/apiCaller";
import { debugResponse } from "@/lib/errorsHandler";
import { appendFormData, seeFormData } from "@/lib/formUtils";
import { ApplicationFormData } from "@/schemas/admission-schema";

/**
 * submit function
 */
export const submitAdmissionForm = async (
    data: ApplicationFormData,
    access_token: string
) => {
    const formData = new FormData();
    const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB
    let totalSize = 0;

    // Prepare FormData
    try {
        appendFormData(formData, data);
        seeFormData(formData); // for debugging
    } catch (error) {
        console.error("FormData preparation failed:", error);
        throw new Error("Failed to prepare form data");
    }
    // Calculate total file size
    for (const value of formData.values()) {
        if (value instanceof File) {
            totalSize += value.size;
        }
    }
    if (totalSize > MAX_UPLOAD_SIZE) {
        throw new Error(`Total upload size ${totalSize} exceeds maximum allowed`);
    }

    try {
        const response = await fetch(`${remoteApiUrl}/application/application-form`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
            body: formData,
        });

        // Only debug successful responses, or debug before error handling
        await debugResponse(response);

        // If response is not ok, try to parse error details FIRST
        if (!response.ok) {
            let errorMessage = `Server error: ${response.status} ${response.statusText}`;

            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.detail || errorMessage;
                console.log('Server error details:', errorData);
            } catch {
                try {
                    const errorText = await response.text();
                    errorMessage = errorText || errorMessage;
                } catch {
                    // Keep default message
                }
            }

            throw new Error(errorMessage);
        }

        const successData = await response.json();
        return successData;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error: Failed to submit application');
    }
};
// ended submit function

export interface DeleteResponse {
    status: boolean;
    message: string;
}
export type DeleteAcademicImageResponse = DeleteResponse;
export type DeleteAcademicResponse = DeleteResponse;
export type DeleteAcademicImagePayload = {
    images_to_delete: string[];
};
export async function deleteAcademicImage(
    id: number,
    urls: string[],
): Promise<DeleteAcademicResponse> {
    const session = { user: { access_token: "" } };//await auth();
    const delUrl = {
        images_to_delete: urls
    }

    const response = await apiCall<DeleteAcademicImagePayload, DeleteAcademicImageResponse>({
        url: `/product/delete-image/${id}`,
        method: "POST",
        data: delUrl,
        accessToken: session?.user.access_token
    });

    if (!response?.status || !response?.message) {
        console.error("Failed to delete product image", response);
        throw new Error("Failed to delete product image");
    }

    return response;
}