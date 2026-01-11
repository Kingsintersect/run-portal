import { ApplicationFormData } from "@/schemas/admission-schema";

export function objectToFormData(obj: Record<string, unknown>): FormData {
    const formData = new FormData();

    function appendFormData(data: unknown, parentKey: string = "") {
        if (data instanceof File) {
            formData.append(parentKey, data);
        } else if (Array.isArray(data)) {
            // Use key[] instead of key[0], key[1] for backend compatibility
            data.forEach((value) => {
                appendFormData(value, `${parentKey}[]`);
            });
        } else if (typeof data === "object" && data !== null) {
            Object.keys(data).forEach((key) => {
                const fullKey = parentKey ? `${parentKey}.${key}` : key;
                appendFormData((data as Record<string, unknown>)[key], fullKey);
            });
        } else if (data !== undefined && data !== null) {
            formData.append(parentKey, data.toString());
        }
    }

    appendFormData(obj);
    return formData;
}

export const appendFormData = (formData: FormData, data: ApplicationFormData) => {
    // Handle regular fields
    Object.entries(data).forEach(([key, value]) => {

        if (value === null || value === undefined) {
            return; // Skip null/undefined values
        } else if (value instanceof File) {
            // Handle File objects
            formData.append(key, value, value.name);
            return;
        } else if (Array.isArray(value)) {
            // Handle arrays (like other_documents)
            value.forEach((item, index) => {
                if (item instanceof File) {
                    formData.append(`${key}[${index}]`, item, item.name);
                } else {
                    formData.append(`${key}[${index}]`, String(item));
                }
            });
            return;
        } else if (typeof value === 'object') {
            // Handle objects
            // If it's a nested object, you might need to flatten it
            // or handle it according to Laravel's expectations
            formData.append(key, JSON.stringify(value));
            return;
        } else if (typeof value === 'boolean') {
            // Convert boolean to string 'true'/'false' (more standard than '1'/'0')
            formData.append(key, value ? "1" : "0");
        } else {
            // Handle primitive values
            formData.append(key, String(value));
        }
    });
};

// Debug function to see FormData contents
export const seeFormData = (formData: FormData) => {
    console.log("=== FormData Contents ===");
    for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
            console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
            console.log(`${key}:`, value);
        }
    }
};