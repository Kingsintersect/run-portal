// External API response types
export interface ExternalAPIResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: {
        current_page: number;
        total_pages: number;
        total_items: number;
        page_size: number;
    };
}

export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended';

export interface Student {
    id: string;
    student_id: string;
    full_name: string;
    email: string;
    phone_number?: string;
    admission_year: number;
    department_code: string;
    department_name: string;
    program_name: string;
    current_status: 'active' | 'inactive' | 'graduated' | 'suspended';
    enrollment_date: string;
    created_at: string;
    updated_at: string;
    enrollment?: {
        academic_session_id: string;
        semester_id: string;
        courses?: Array<{
            course_code: string;
            course_name: string;
            credits: number;
        }>;
    };
}

export interface AcademicSession {
    id: string;
    code: string;
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    status: 'active' | 'completed' | 'upcoming';
}

export interface Semester {
    id: string;
    academic_session_id: string;
    code: string;
    name: string;
    order: number;
    start_date: string;
    end_date: string;
    is_current: boolean;
}

export interface Department {
    code: string;
    name: string;
    faculty: string;
}

export interface StudentFilters {
    academic_session_id: string;
    semester_id: string;
    search?: string;
    department_code?: string | 'all';
    status?: StudentStatus | 'all';
    admission_year?: number;
}

export interface StudentQueryParams extends StudentFilters {
    page: number;
    limit: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface PaginationInfo {
    current_page: number;
    total_pages: number;
    total_items: number;
    page_size: number;
}