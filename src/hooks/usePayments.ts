import { remoteApiUrl } from "@/config";
import { useMutation } from "@tanstack/react-query";

interface InitialideApplicationFormPurchaseResponse {
    // define your expected response structure
    status: number | string;
    message?: string;
    data?: Record<string, unknown>;
    error: [];
}

async function InitializeApplicationFormPurchase(access_token: string): Promise<InitialideApplicationFormPurchaseResponse> {
    const res = await fetch(`${remoteApiUrl}/application/retry-purchase`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch retry purchase data");
    }

    const result = await res.json();
    console.log('result', result)
    return result;
}

export function useApplicationFormPurchase() {
    return useMutation<InitialideApplicationFormPurchaseResponse, Error, { access_token: string }>({
        mutationFn: ({ access_token }) => InitializeApplicationFormPurchase(access_token),
    });
}
