import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ApiClient } from '../lib/api-client';
import {
    Student,
    StudentFilters,
    AcademicSession,
    Semester,
    Department,
    PaginationInfo
} from '../types/student';

interface StudentStoreState {
    // State
    students: Student[];
    isLoading: boolean;
    error: string | null;
    pagination: PaginationInfo;
    filters: StudentFilters;
    academicSessions: AcademicSession[];
    semesters: Semester[];
    departments: Department[];

    // Actions
    setFilters: (filters: Partial<StudentFilters>) => void;
    setPageSize: (pageSize: number) => void;
    setCurrentPage: (page: number) => void;
    setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    fetchStudents: (accessToken?: string) => Promise<void>; // Accept token as parameter
    fetchAcademicData: (accessToken?: string) => Promise<void>;
    resetFilters: () => void;
    clearError: () => void;
}

const initialFilters: StudentFilters = {
    academic_session_id: '',
    semester_id: '',
    search: '',
    department_code: '',
};

const initialPagination: PaginationInfo = {
    current_page: 1,
    total_pages: 0,
    total_items: 0,
    page_size: 25,
};

export const useStudentStore = create<StudentStoreState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                students: [],
                isLoading: false,
                error: null,
                pagination: initialPagination,
                filters: initialFilters,
                academicSessions: [],
                semesters: [],
                departments: [],

                // Actions
                setFilters: (newFilters) => {
                    const updatedFilters = { ...get().filters, ...newFilters };

                    // Type-safe handling of 'all' values
                    if (updatedFilters.department_code === 'all') {
                        updatedFilters.department_code = undefined;
                    }

                    if (updatedFilters.status === 'all') {
                        updatedFilters.status = undefined;
                    }

                    set({
                        filters: updatedFilters as StudentFilters, // Cast to ensure type safety
                        pagination: { ...get().pagination, current_page: 1 },
                    });

                    // If academic session changed, fetch semesters
                    if (newFilters.academic_session_id &&
                        newFilters.academic_session_id !== get().filters.academic_session_id) {
                        get().fetchAcademicData();
                    }

                    get().fetchStudents();
                },

                setPageSize: (pageSize) => {
                    set((state) => ({
                        pagination: {
                            ...state.pagination,
                            page_size: pageSize,
                            current_page: 1
                        },
                    }));
                    get().fetchStudents();
                },

                setCurrentPage: (page) => {
                    set((state) => ({
                        pagination: { ...state.pagination, current_page: page },
                    }));
                    get().fetchStudents();
                },

                setSorting: (sortBy, sortOrder) => {
                    // In a real implementation, you'd update filters and refetch
                    // For now, we'll just trigger a refetch with current filters
                    get().fetchStudents();
                },

                fetchStudents: async (accessToken?: string) => {
                    const { filters, pagination } = get();

                    // Validate required filters
                    if (!filters.academic_session_id || !filters.semester_id) {
                        return;
                    }

                    set({ isLoading: true, error: null });

                    try {
                        const queryParams = {
                            academic_session_id: filters.academic_session_id,
                            semester_id: filters.semester_id,
                            page: pagination.current_page,
                            limit: pagination.page_size,
                            ...(filters.search && { search: filters.search }),
                            ...(filters.department_code && { department_code: filters.department_code }),
                            ...(filters.status && { status: filters.status }),
                            ...(filters.admission_year && { admission_year: filters.admission_year }),
                            ...(accessToken && { access_token: accessToken }), // Pass token if provided
                        };

                        const response = await ApiClient.getStudents(queryParams);

                        if (!response.success) {
                            throw new Error(response.message || 'Failed to fetch students');
                        }

                        set({
                            students: response.data,
                            pagination: response.pagination || initialPagination,
                            isLoading: false,
                        });
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : 'An error occurred',
                            isLoading: false,
                        });
                    }
                },

                fetchAcademicData: async (accessToken?: string) => {
                    const { filters } = get();

                    try {
                        // Fetch academic sessions with token
                        const sessionsResponse = await ApiClient.getAcademicSessions(accessToken);
                        if (sessionsResponse.success) {
                            set({ academicSessions: sessionsResponse.data });

                            // Auto-select current session
                            const currentSession = sessionsResponse.data.find(s => s.is_current);
                            if (currentSession && !filters.academic_session_id) {
                                get().setFilters({ academic_session_id: currentSession.id });
                            }
                        }

                        // Fetch semesters with token
                        if (filters.academic_session_id) {
                            const semestersResponse = await ApiClient.getSemestersBySession(
                                filters.academic_session_id,
                                accessToken
                            );
                            if (semestersResponse.success) {
                                set({ semesters: semestersResponse.data });

                                const currentSemester = semestersResponse.data.find(s => s.is_current);
                                if (currentSemester && !filters.semester_id) {
                                    get().setFilters({ semester_id: currentSemester.id });
                                }
                            }
                        }

                        // Fetch departments with token
                        const departmentsResponse = await ApiClient.getDepartments(accessToken);
                        if (departmentsResponse.success) {
                            set({ departments: departmentsResponse.data });
                        }
                    } catch (error) {
                        console.error('Failed to fetch academic data:', error);
                    }
                },

                resetFilters: () => {
                    set({
                        filters: initialFilters,
                        pagination: initialPagination,
                    });
                },

                clearError: () => {
                    set({ error: null });
                },
            }),
            {
                name: 'student-store',
                partialize: (state) => ({
                    filters: state.filters,
                    pagination: { page_size: state.pagination.page_size },
                }),
            }
        )
    )
);