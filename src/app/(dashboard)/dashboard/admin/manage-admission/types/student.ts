import { UserInterface } from "@/config/Types";

export interface Metadata {
    active_session: string;
    pagination: Pagination;
    sorting: Sorting;
}

export interface Pagination {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
}

export interface Sorting {
    sort_by: string;
    sort_order: 'asc' | 'desc' | string;
}

// External API response types
export interface ExternalAPIResponse<T> {
    status: number;
    success: boolean;
    data: T;
    message?: string;
    metadata?: Metadata;
}

// export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended';

export interface Student extends UserInterface{
    // id: number;
    student_id: string;
    full_name: string;
    email: string;
    // phone_number?: string;
    admission_year: number;
    program_id: string;
    department_name: string;
    program_name: string;
    current_status: 'active' | 'inactive' | 'graduated' | 'suspended';
    enrollment_date: string;
    created_at: string;
    updated_at: string;
    enrollment?: {
        academic_session: string;
        program_id: string;
        courses?: Array<{
            course_code: string;
            course_name: string;
            credits: number;
        }>;
    };
}

export interface AcademicSession {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: "ACTIVE" | "INACTIVE";
}

export interface Department {
    code: string;
    name: string;
    faculty: string;
}
export interface ProgramItem {
    id: number;
    name: string;
    parent: number;
    sortorder: number;
}
export interface MappedProgramItem {
    id: number;
    label: string;
    value: string;
}
export interface StudentFilters {
    academic_session: string;
    application_status: string;
    search?: string;
    program_id?: string | 'all';
    parent_program_id?: string | 'all';
    // addiition
    admission_status?: string;
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