"use server";

import { apiCall } from "@/lib/apiCaller";

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