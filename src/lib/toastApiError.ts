import { toast } from "sonner";
type LaravelErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
    [key: string]: unknown;
};

export function toastApiError(error: unknown, fallback = "Something went wrong") {
    // 1. If the error is an instance of Error
    if (error instanceof Error) {
        try {
            // Try to parse the JSON string inside the error message
            const parsed = JSON.parse(error.message);
            return toastApiError(parsed, fallback);
        } catch {
            // If it's not JSON, show the raw message
            return toast.error("Error!", { description: error.message || fallback });
        }
    }

    // 2. If it's a JSON string
    if (typeof error === "string") {
        try {
            const parsed = JSON.parse(error);
            return toastApiError(parsed, fallback);
        } catch {
            return toast.error("Error!", { description: error });
        }
    }

    // 3. Laravel-style object
    if (typeof error === "object" && error !== null) {
        const maybeLaravel = error as LaravelErrorResponse;

        if (maybeLaravel.errors && typeof maybeLaravel.errors === "object") {
            const firstError = Object.values(maybeLaravel.errors)[0]?.[0];
            if (firstError) {
                return toast.error("Error!", { description: firstError });
            }
        }

        if (maybeLaravel.message) {
            return toast.error("Error!", { description: maybeLaravel.message });
        }
    }

    // 4. Fallback
    return toast.error("Error!", { description: fallback });
}


export function toastSuccess(message: string) {
    toast.success('Success! ', {
        description: message,
    })
}


// Utility function to extract first error message from validation errors
export function getFirstErrorMessage(errors: Record<string, string[]>): string {
    const firstField = Object.keys(errors)[0];
    return errors[firstField]?.[0] || "Validation error occurred";
}

// Utility function to get all error messages
export function getAllErrorMessages(errors: Record<string, string[]>): string[] {
    return Object.values(errors).flat();
}