
export const extractErrorMessages = (error: unknown): string[] => {
	// Handle null/undefined
	if (!error) return ["iNVALID ERROR DATA TYPE OF NULL/UNDEFINED"];

	// Handle strings
	if (typeof error === 'string') return [error];

	// Handle arrays
	if (Array.isArray(error)) {
		return error.map(err =>
			typeof err === 'string' ? err :
				typeof err === 'object' && err !== null && 'message' in err ?
					String((err as any).message) :
					JSON.stringify(err)
		);
	}

	// Handle objects
	if (typeof error === 'object' && error !== null) {
		const errObj = error as Record<string, any>;

		// Check for top-level message
		if (errObj.message) return [String(errObj.message)];

		// Check for errors object (common in API responses)
		if (errObj.errors && typeof errObj.errors === 'object') {
			return Object.values(errObj.errors).flatMap(err =>
				Array.isArray(err) ? err.map(String) : [String(err)]
			);
		}

		// Fallback: stringify the object
		return [JSON.stringify(error)];
	}

	// Handle other types (numbers, booleans, etc.)
	return [String(error)];
};

export function handleHttpError(
	error: any,
	message = "",
	requestType = ""
): object {
	const msg =
		typeof error.response?.data === "object"
			? error.response.data
			: { message: error.message };

	if (error.response) {
		console.error(
			`${requestType} failed: Server responded with status ${error.response.status}`
		);
		return { success: false, message: msg || `${message}`, status: "failed" };
	} else if (error.request) {
		// The request was made, but no response received
		console.error(
			`${requestType} failed: No response from server. Please check your connection.`
		);
		return {
			success: false,
			message: "No response from server. Please check your connection.",
		};
	} else {
		// Something happened in setting up the request
		console.error(
			`${requestType} failed: Something went wrong while sending the request.`
		);
		return {
			success: false,
			message: "Something went wrong while sending the request.",
		};
	}
}

export function displayErrors(errorObject) {
	const errorMsg: string[] = [];
	for (const field in errorObject) {
		if (errorObject.hasOwnProperty(field)) {
			const errorMessages = errorObject[field];
			errorMessages?.forEach((error) => {
				if (error !== "") errorMsg.push(`${field}: ${error}`);
			});
		}
	}
	return errorMsg;
}

export const getFormFriendlyError = (error: unknown): string => {
	if (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as any).message === "string"
	) {
		const rawMessage = (error as any).message as string;

		// Extract JSON from the message string
		const match = rawMessage.match(/{.*}/);
		if (match) {
			try {
				const parsed = JSON.parse(match[0]);
				return parsed.message || "An error occurred. Please try again.";
			} catch {
				return "An error occurred. Please try again.";
			}
		}

		return rawMessage;
	}

	return "An unexpected error occurred. Please try again.";
};

// lib/errorsHandler.ts
export const getAPIFriendlyError = (error: unknown): string => {
	console.log("Raw error object:", error);

	// If it's already a user-friendly string
	if (typeof error === 'string') {
		return error;
	}

	// If it's an Error object
	if (error instanceof Error) {
		const message = error.message;

		// Check for server error patterns
		if (message.includes('Server error')) {
			return message; // Use the detailed server error message
		}

		if (message.includes('Missing access token')) {
			return 'Your session has expired. Please refresh the page and try again.';
		}

		if (message.includes('Network request failed') || message.includes('Failed to fetch')) {
			return 'Network connection failed. Please check your internet connection and try again.';
		}

		return message || 'An unexpected error occurred. Please try again.';
	}

	// If it's an object with a message property
	if (typeof error === 'object' && error !== null && 'message' in error) {
		return (error as { message: string }).message;
	}

	// Default fallback
	return 'An unexpected error occurred. Please try again.';
};
// Use it in your mutation function:
// const response = await submitAdmissionForm(transformedData as ApplicationFormData, access_token);
// const debuggedResponse = await debugResponse(response);
export const debugResponse = async (response: Response) => {
	console.log('Response status:', response.status);
	console.log('Response headers:', Object.fromEntries(response.headers.entries()));

	// Clone the response to read without consuming
	const responseClone = response.clone();

	try {
		const text = await responseClone.text();
		console.log('Response body:', text);

		// Try to parse as JSON if possible
		try {
			const json = JSON.parse(text);
			console.log('Parsed JSON:', json);
		} catch {
			console.log('Response is not JSON');
		}
	} catch (error) {
		console.error('Error reading response:', error);
	}

	// Return the original response for further use
	return response;
};


export async function handleApiError(res: Response): Promise<never> {
	let message = `Request failed with status ${res.status}`;
	console.log('res', res);

	try {
		const contentType = res.headers.get("content-type") || "";

		if (contentType.includes("application/json")) {
			const error = await res.json();
			message = error?.message || JSON.stringify(error) || message;
		} else {
			const text = await res.text();
			if (res.status === 503 && text.includes("Service Unavailable")) {
				message = "The server is temporarily unavailable (503). Please try again shortly.";
			} else {
				message = "Unexpected error occurred. Please try again.";
			}
		}
	} catch (err) {
		message = "An unknown error occurred while processing the response.";
		console.log('Raw Error', err)
	}

	throw new Error(message);
}
export function throwFormattedError(errorResponse: {
	errors?: Record<string, string[] | string>;
	message?: string;
	[key: string]: any;
}): never {
	let errorMessage: string;

	// Handle error responses with nested errors object
	if (errorResponse.errors && typeof errorResponse.errors === 'object') {
		const formattedErrors = Object.entries(errorResponse.errors)
			.map(([field, messages]) => {
				if (Array.isArray(messages)) {
					return `${field}: ${messages.join(', ')}`;
				}
				return `${field}: ${messages}`;
			})
			.join('\n');

		errorMessage = formattedErrors;
	}
	// Fallback to regular message or stringify
	else {
		errorMessage = errorResponse.message || JSON.stringify(errorResponse);
	}
	console.log('errorMessage fromhandler', errorMessage)
	throw new Error(errorMessage);
}

type FieldError = {
	message?: string;
	[key: string]: unknown;
};

export const getReactHookFormErrorMessages = (errors: Record<string, FieldError>) => {
	if (!errors) return [];

	const errorMessages: string[] = [];

	const extractErrors = (obj: any, path: string = '') => {
		Object.entries(obj).forEach(([key, value]) => {
			const currentPath = path ? `${path}.${key}` : key;

			if (value && typeof value === 'object') {
				if ('message' in value && typeof value.message === 'string') {
					// Use the actual error message from Zod
					errorMessages.push(value.message);
				} else {
					// Recursively check nested objects
					extractErrors(value, currentPath);
				}
			}
		});
	};

	extractErrors(errors);
	return errorMessages;
};