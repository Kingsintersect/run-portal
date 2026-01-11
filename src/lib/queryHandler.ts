import { remoteApiUrl } from "@/config";


type FetchMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
interface FetchOptions<T> {
    url: string;
    method?: FetchMethod;
    data?: T;
    accessToken?: string;
}
export const queryHandler = async <TRequest = unknown, TResponse = unknown>({
    url,
    method = "GET",
    data,
    accessToken,
}: FetchOptions<TRequest>): Promise<TResponse | null> => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

    const headers: HeadersInit = {};
    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    try {
        const response = await fetch(`${remoteApiUrl}${url}`, {
            method,
            headers,
            body: method !== "GET"
                ? isFormData
                    ? data as FormData
                    : JSON.stringify(data)
                : undefined,
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return null;
        }
    } catch (err) {
        console.error("NETWORK ERROR:", err);
        return null;
    }
};
