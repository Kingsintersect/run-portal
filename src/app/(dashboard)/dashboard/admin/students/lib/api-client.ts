// app/admin/students/lib/api-client.ts
import { AcademicSession, ExternalAPIResponse, ProgramItem, Student, StudentFilters, StudentQueryParams } from "../types/student";

// Configuration
const EXTERNAL_API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN;
const API_TIMEOUT = 30000; // 30 seconds

interface RequestOptions extends RequestInit {
    timeout?: number;
}

class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public data?: unknown,
        public endpoint?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class ApiClient {
    // Store access token (could be from localStorage, session, or other source)
    private static accessToken: string | null = null;

    // Method to set the access token (call this after login)
    static setAccessToken(token: string | null): void {
        this.accessToken = token;
        if (token) {
            // Optionally store in localStorage for persistence
            localStorage.setItem('access_token', token);
        } else {
            localStorage.removeItem('access_token');
        }
    }

    // Method to get access token from localStorage on initialization
    static initializeToken(): void {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token) {
                this.accessToken = token;
            }
        }
    }

    private static async request<T>(
        endpoint: string,
        options: RequestOptions = {},
        includeAccessToken: boolean = true
    ): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            options.timeout || API_TIMEOUT
        );

        try {
            // Validate configuration
            if (!EXTERNAL_API_BASE) {
                console.error('API base URL is not configured');
                throw new ApiError('API base URL is not configured', 500, {}, endpoint);
            }

            const headers = new Headers(options.headers);
            if (includeAccessToken && this.accessToken) {
                headers.set('Authorization', `Bearer ${this.accessToken}`);
            }
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');

            // Build URL with query parameters
            const url = `${EXTERNAL_API_BASE}/api/v1${endpoint}`;

            // // Add access_token as query parameter if needed
            // if (includeAccessToken && this.accessToken) {
            //     const separator = url.includes('?') ? '&' : '?';
            //     url += `${separator}access_token=${encodeURIComponent(this.accessToken)}`;
            // }

            console.log(`[API Request] ${options.method || 'GET'} ${url}`);
            console.log('Access token included:', includeAccessToken && !!this.accessToken);

            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal,
                // credentials: 'include', // Still send HTTP-only cookies
            });

            clearTimeout(timeoutId);

            // Check for authentication issues
            if (response.status === 401) {
                console.error('Authentication failed');
                // Clear invalid token
                this.setAccessToken(null);

                throw new ApiError(
                    'Authentication failed. Please log in again.',
                    401,
                    {},
                    endpoint
                );
            }

            if (!response.ok) {
                let errorData;
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

                try {
                    const text = await response.text();
                    console.log(`[API Error Response]`, text.substring(0, 500));

                    if (text) {
                        try {
                            errorData = JSON.parse(text);
                            errorMessage = errorData.message || errorData.error || text.substring(0, 200);
                        } catch {
                            errorData = { raw: text };
                            errorMessage = text.substring(0, 200);
                        }
                    } else {
                        errorData = { message: 'Empty response' };
                    }
                } catch (parseError) {
                    console.error('[API Parse Error]', parseError);
                    errorData = { message: 'Failed to parse error response' };
                }

                throw new ApiError(
                    errorMessage,
                    response.status,
                    errorData,
                    endpoint
                );
            }

            const responseText = await response.text();
            console.log(`[API Success Response]`, responseText.substring(0, 500));

            try {
                const data = JSON.parse(responseText);
                return data as T;
            } catch (parseError) {
                console.error('[API JSON Parse Error]', parseError, responseText);
                throw new ApiError(
                    'Invalid JSON response from server',
                    500,
                    { raw: responseText },
                    endpoint
                );
            }

        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof ApiError) {
                console.error('[API Error]', error.message, error.endpoint);
                throw error;
            }

            if (error instanceof Error && error.name === 'AbortError') {
                console.error('[API Timeout]', endpoint);
                throw new ApiError('Request timeout', 408, {}, endpoint);
            }

            console.error('[API Network Error]', error);
            throw new ApiError(
                error instanceof Error ? error.message : 'Network error',
                0,
                error,
                endpoint
            );
        }
    }

    // Initialize token on module load
    static {
        if (typeof window !== 'undefined') {
            this.initializeToken();
        }
    }

    // Academic sessions - accepts access_token as optional parameter
    static async getAcademicSessions(accessToken?: string): Promise<ExternalAPIResponse<AcademicSession[]>> {
        try {
            // Use provided token or fall back to stored token
            const tokenToUse = accessToken || this.accessToken;

            if (!tokenToUse) {
                console.warn('No access token provided for getAcademicSessions');
            }

            const result = await this.request<ExternalAPIResponse<AcademicSession[]>>('/all-sessions');

            return result;
        } catch (error) {
            console.error('Failed to fetch academic sessions:', error);
            return {
                status: 500,
                success: false,
                data: [],
                message: error instanceof ApiError ? error.message : 'Failed to load academic sessions'
            };
        }
    }


    // Departments with fallback
    static async getDepartments(accessToken?: string): Promise<ExternalAPIResponse<ProgramItem[]>> {
        try {
            const tokenToUse = accessToken || this.accessToken;

            if (!tokenToUse) {
                console.warn('No access token provided for getDepartments');
            }

            const result = await this.request<ExternalAPIResponse<ProgramItem[]>>('/odl/categories');

            return result;
        } catch (error) {
            console.error('Failed to fetch departments:', error);
            return {
                status: 500,
                success: false,
                data: [],
                message: error instanceof ApiError ? error.message : 'Failed to load departments'
            };
        }
    }

    // Students with pagination and fallback
    static async getStudents(
        params: StudentQueryParams & { access_token?: string }
    ): Promise<ExternalAPIResponse<Student[]>> {
        console.log('Fetching students with params:', params);
        try {
            const queryParams = new URLSearchParams();

            // Required parameters
            queryParams.append('academic_session', params.academic_session);
            queryParams.append('application_status', params.application_status);
            queryParams.append('page', params.page.toString());
            queryParams.append('limit', params.limit.toString());

            // Optional parameters
            if (params.search) {
                queryParams.append('search', params.search);
            }
            if (params.program_id) {
                queryParams.append('program_id', params.program_id);
            }
            if (params.sort_by) {
                queryParams.append('sort_by', params.sort_by);
            }
            if (params.sort_order) {
                queryParams.append('sort_order', params.sort_order);
            }
            // Add access_token to query params if provided
            if (params.admission_status) {
                queryParams.append('admission_status', params.admission_status);
            }

            // Temporarily override token if provided
            const originalToken = this.accessToken;
            if (params.access_token && params.access_token !== this.accessToken) {
                this.accessToken = params.access_token;
            }

            const result = await this.request<ExternalAPIResponse<Student[]>>(`/admin/manage-students?${queryParams}`, {}, true); // false = don't auto-add token

            // Restore original token
            if (params.access_token && params.access_token !== originalToken) {
                this.accessToken = originalToken;
            }

            return result;
        } catch (error) {
            console.error('Failed to fetch students:', error);
            return {
                status: 500,
                success: false,
                data: [],
                message: error instanceof ApiError ? error.message : 'Failed to load students',
                metadata: {
                    pagination: {
                        current_page: params.page,
                        total_pages: 0,
                        total: 0,
                        count: 0,
                        limit: params.limit
                    },
                    sorting: {
                        sort_by: params.sort_by || '',
                        sort_order: params.sort_order || ''
                    },
                    active_session: params.academic_session
                }
            };
        }
    }

    // Export students
    static async exportStudents(
        filters: StudentFilters & { access_token?: string },
        format: 'csv' | 'excel' | 'pdf' = 'csv'
    ): Promise<Blob> {
        const queryParams = new URLSearchParams();

        // Required parameters
        queryParams.append('academic_session', filters.academic_session);
        queryParams.append('application_status', filters.application_status);
        queryParams.append('format', format);

        // Optional parameters
        if (filters.search) {
            queryParams.append('search', filters.search);
        }
        if (filters.program_id) {
            queryParams.append('program_id', filters.program_id);
        }
        // Add access_token to query params if provided
        if (filters.access_token) {
            queryParams.append('access_token', filters.access_token);
        }

        // Temporarily override token if provided
        const originalToken = this.accessToken;
        if (filters.access_token && filters.access_token !== this.accessToken) {
            this.accessToken = filters.access_token;
        }

        try {
            const response = await this.request<Blob>(
                `/students/export?${queryParams}`,
                {
                    headers: {
                        'Accept': format === 'csv'
                            ? 'text/csv'
                            : format === 'excel'
                                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                : 'application/pdf'
                    },
                },
                false // false = don't auto-add token
            );

            return response;
        } catch (error) {
            console.error('Export failed:', error);
            throw error;
        } finally {
            // Restore original token
            if (filters.access_token && filters.access_token !== originalToken) {
                this.accessToken = originalToken;
            }
        }
    }
}