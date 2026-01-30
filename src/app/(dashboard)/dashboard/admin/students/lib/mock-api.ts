// app/admin/students/lib/mock-api.ts
import { AcademicSession, Department, ExternalAPIResponse, Semester, Student, StudentFilters, StudentQueryParams } from "../types/student";

const generateMockStudents = (count: number): Student[] => {
    const students: Student[] = [];
    const departments = ['CS', 'EE', 'ME', 'CE', 'PH'];
    const programs = ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc'];
    const statuses = ['active', 'inactive', 'graduated', 'suspended'] as const;

    for (let i = 1; i <= count; i++) {
        students.push({
            id: `student-${i}`,
            student_id: `STU${String(i).padStart(5, '0')}`,
            full_name: `Student ${i}`,
            email: `student${i}@university.edu`,
            phone_number: `+91${9000000000 + i}`,
            admission_year: 2020 + (i % 4),
            department_code: departments[i % departments.length],
            department_name: `${departments[i % departments.length]} Department`,
            program_name: programs[i % programs.length],
            current_status: statuses[i % statuses.length],
            enrollment_date: new Date(2020 + (i % 4), 0, 1).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
    }

    return students;
};

const mockStudents = generateMockStudents(10000);
const mockAcademicSessions: AcademicSession[] = [
    {
        id: '2023-2024',
        code: '2023-24',
        name: '2023-2024 Academic Year',
        start_date: '2023-07-01',
        end_date: '2024-06-30',
        is_current: true,
        status: 'active'
    },
    {
        id: '2022-2023',
        code: '2022-23',
        name: '2022-2023 Academic Year',
        start_date: '2022-07-01',
        end_date: '2023-06-30',
        is_current: false,
        status: 'completed'
    }
];

const mockSemesters: Semester[] = [
    { id: 'sem1-2023', academic_session_id: '2023-2024', code: 'SEM1', name: 'Semester 1', order: 1, start_date: '2023-07-01', end_date: '2023-12-31', is_current: true },
    { id: 'sem2-2023', academic_session_id: '2023-2024', code: 'SEM2', name: 'Semester 2', order: 2, start_date: '2024-01-01', end_date: '2024-06-30', is_current: false },
    { id: 'sem1-2022', academic_session_id: '2022-2023', code: 'SEM1', name: 'Semester 1', order: 1, start_date: '2022-07-01', end_date: '2022-12-31', is_current: false },
];

const mockDepartments: Department[] = [
    { code: 'CS', name: 'Computer Science', faculty: 'Engineering' },
    { code: 'EE', name: 'Electrical Engineering', faculty: 'Engineering' },
    { code: 'ME', name: 'Mechanical Engineering', faculty: 'Engineering' },
    { code: 'CE', name: 'Civil Engineering', faculty: 'Engineering' },
    { code: 'PH', name: 'Physics', faculty: 'Science' },
];

export class MockApiClient {
    static async getAcademicSessions(): Promise<ExternalAPIResponse<AcademicSession[]>> {
        await this.delay(300);
        return {
            success: true,
            data: mockAcademicSessions
        };
    }

    static async getSemestersBySession(academicSessionId: string): Promise<ExternalAPIResponse<Semester[]>> {
        await this.delay(300);
        return {
            success: true,
            data: mockSemesters.filter(s => s.academic_session_id === academicSessionId)
        };
    }

    static async getDepartments(): Promise<ExternalAPIResponse<Department[]>> {
        await this.delay(300);
        return {
            success: true,
            data: mockDepartments
        };
    }

    static async getStudents(params: StudentQueryParams): Promise<ExternalAPIResponse<Student[]>> {
        await this.delay(500);

        let filtered = [...mockStudents];

        // Apply filters
        if (params.search) {
            const searchLower = params.search.toLowerCase();
            filtered = filtered.filter(s =>
                s.full_name.toLowerCase().includes(searchLower) ||
                s.student_id.toLowerCase().includes(searchLower) ||
                s.email.toLowerCase().includes(searchLower)
            );
        }

        if (params.department_code) {
            filtered = filtered.filter(s => s.department_code === params.department_code);
        }

        if (params.status) {
            filtered = filtered.filter(s => s.current_status === params.status);
        }

        if (params.admission_year) {
            filtered = filtered.filter(s => s.admission_year === params.admission_year);
        }

        // Calculate pagination
        const page = params.page;
        const limit = params.limit;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginated = filtered.slice(startIndex, endIndex);

        return {
            success: true,
            data: paginated,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(filtered.length / limit),
                total_items: filtered.length,
                page_size: limit
            }
        };
    }

    static async exportStudents(filters: StudentFilters, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
        await this.delay(1000);

        // Create a simple CSV
        const headers = ['Student ID,Name,Email,Department,Program,Admission Year,Status\n'];
        const data = mockStudents.slice(0, 10).map(s =>
            `${s.student_id},${s.full_name},${s.email},${s.department_name},${s.program_name},${s.admission_year},${s.current_status}`
        );

        const csvContent = headers.join('') + data.join('\n');
        return new Blob([csvContent], { type: 'text/csv' });
    }

    private static delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}