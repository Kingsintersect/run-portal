import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ApiClient } from '../lib/api-client';
import {
    Student,
    StudentFilters,
    ProgramItem,
    PaginationInfo,
    AcademicSession
} from '../types/student';
import { mapToPaginationInfo } from '../lib/utils';

interface StudentStoreState {
    // State
    students: Student[];
    isLoading: boolean;
    error: string | null;
    pagination: PaginationInfo;
    filters: StudentFilters;
    academicSessions: AcademicSession[];
    // semesters: Semester[];
    allPrograms: ProgramItem[];  // Store ALL programs
    parentPrograms: ProgramItem[];  // Only parent programs (parent === 0)
    childPrograms: ProgramItem[];   // Child programs based on selected parent

    // Actions
    setFilters: (filters: Partial<StudentFilters>) => void;
    setPageSize: (pageSize: number) => void;
    setCurrentPage: (page: number) => void;
    setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    fetchStudents: (accessToken?: string) => Promise<void>;
    fetchAcademicData: (accessToken?: string) => Promise<void>;
    resetFilters: () => void;
    clearError: () => void;
    // Add this action
    updateChildPrograms: (parentId?: number, allPrograms?: ProgramItem[]) => void;

    sorting: {
        sort_by: string;
        sort_order: 'asc' | 'desc';
    };
}

const initialFilters: StudentFilters = {
    academic_session: '',
    application_status: '',
    search: '',
    program_id: '',
    parent_program_id: '',
    admission_status: '',
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
                allPrograms: [],
                parentPrograms: [],
                childPrograms: [],
                sorting: {
                    sort_by: 'created_at',
                    sort_order: 'desc',
                },

                // Actions
                setFilters: (newFilters) => {
                    const state = get();
                    const updatedFilters = { ...state.filters, ...newFilters };

                    // Type-safe handling of 'all' values
                    if (updatedFilters.parent_program_id === 'all') {
                        updatedFilters.parent_program_id = undefined;
                        updatedFilters.program_id = undefined; // Clear child program when parent is "all"
                    }
                    if (updatedFilters.program_id === 'all') {
                        updatedFilters.program_id = undefined;
                    }

                    if (updatedFilters.admission_status === 'all') {
                        updatedFilters.admission_status = undefined;
                    }

                    // Only trigger API call if these specific fields change
                    const shouldTriggerAPICall =
                        newFilters.academic_session !== undefined ||
                        newFilters.application_status !== undefined ||
                        newFilters.program_id !== undefined ||
                        newFilters.search !== undefined ||
                        newFilters.admission_status !== undefined

                    set({
                        filters: updatedFilters as StudentFilters,
                        pagination: { ...state.pagination, current_page: 1 },
                    });

                    // If parent_program_id changed, update child programs
                    if (newFilters.parent_program_id !== undefined) {
                        const parentId = newFilters.parent_program_id ? parseInt(newFilters.parent_program_id) : undefined;
                        get().updateChildPrograms(parentId);
                    }

                    // Only fetch students if relevant filters changed
                    if (shouldTriggerAPICall) {
                        get().fetchStudents();
                    }
                },

                // Add this new action
                updateChildPrograms: (parentId?: number, allPrograms?: ProgramItem[]) => {
                    const state = get();
                    const programsToFilter = allPrograms || state.allPrograms;

                    if (!parentId || !programsToFilter.length) {
                        set({ childPrograms: [] });
                        return;
                    }

                    // Filter child programs from the provided programs
                    const childPrograms = programsToFilter.filter(item => item.parent === parentId);
                    set({ childPrograms });

                    // Optional: Auto-select first child program when parent changes
                    // Only if no child program is currently selected
                    if (childPrograms.length > 0 && !state.filters.program_id) {
                        // You can enable this if you want to auto-select first child
                        // const newFilters = { ...state.filters, program_id: String(childPrograms[0].id) };
                        // set({ filters: newFilters as StudentFilters });
                    }
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

                setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => {
                    set((state) => ({
                        sorting: { ...state.sorting, sort_by: sortBy, sort_order: sortOrder },
                    }));
                    get().fetchStudents();
                },

                fetchStudents: async (accessToken?: string) => {
                    const { filters, pagination, sorting } = get();

                    // Validate required filters
                    if (!filters.academic_session) {
                        return;
                    }

                    set({ isLoading: true, error: null });

                    try {
                        const queryParams = {
                            academic_session: filters.academic_session,
                            application_status: filters.application_status,
                            page: pagination.current_page,
                            limit: pagination.page_size,
                            ...(filters.search && { search: filters.search }),
                            ...(filters.program_id && { program_id: filters.program_id }),
                            ...(filters.admission_status && { admission_status: filters.admission_status }),

                            // ADD THESE PARAMETERS:
                            sort_by: sorting.sort_by,
                            sort_order: sorting.sort_order,

                            ...(accessToken && { access_token: accessToken }),
                        };

                        const response = await ApiClient.getStudents(queryParams);

                        if (response.status !== 200 || !response.success) {
                            throw new Error(response.message || 'Failed to fetch students');
                        }

                        // Update pagination from response
                        const updatedPagination = response.metadata?.pagination
                            ? mapToPaginationInfo(response.metadata.pagination)
                            : pagination;

                        set({
                            students: response.data,
                            pagination: updatedPagination,
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

                        if (sessionsResponse.status === 200) {
                            const academicSessions = sessionsResponse.data;
                            set({ academicSessions });

                            // Auto-select current session
                            const currentSession = academicSessions.find(s => s.status === "ACTIVE");
                            console.log('Current Academic Session:', currentSession);
                            if (currentSession && !filters.academic_session) {
                                console.log('Setting default academic session to:', currentSession.name);
                                const newFilters = { ...filters, academic_session: currentSession.name };
                                set({ filters: newFilters as StudentFilters });
                                // This will trigger fetchStudents because academic_session changed
                            }
                        }

                        // Fetch ALL programs with token
                        const programsResponse = await ApiClient.getDepartments(accessToken);

                        if (programsResponse.data.length > 0) {
                            const allPrograms = programsResponse.data.map(item => ({
                                ...item,
                                label: item.name.trim(),
                                value: String(item.id)
                            }));

                            // Filter parent programs
                            const parentPrograms = allPrograms.filter(item => item.parent === 0);

                            set({
                                allPrograms,
                                parentPrograms
                            });

                            // If we have a selected parent program, update child programs
                            if (filters.parent_program_id && filters.parent_program_id !== 'all') {
                                const parentId = parseInt(filters.parent_program_id);
                                get().updateChildPrograms(parentId, allPrograms);
                            }
                        } else {
                            console.log('No programs fetched or error:', programsResponse);
                        }
                    } catch (error) {
                        console.error('Failed to fetch academic data:', error);
                    }
                },

                resetFilters: () => {
                    set({
                        filters: initialFilters,
                        pagination: initialPagination,
                        childPrograms: [],
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


export const useAllPrograms = () => useStudentStore((state) => state.allPrograms);
export const useParentPrograms = () => useStudentStore((state) => state.parentPrograms);
export const useChildPrograms = () => useStudentStore((state) => state.childPrograms);
export const useAcademicSessions = () => useStudentStore((state) => state.academicSessions);
export const useFilters = () => useStudentStore((state) => state.filters);
export const useIsLoading = () => useStudentStore((state) => state.isLoading);
export const useStudentActions = () => ({
    setFilters: useStudentStore((state) => state.setFilters),
    resetFilters: useStudentStore((state) => state.resetFilters),
    updateChildPrograms: useStudentStore((state) => state.updateChildPrograms),
    // ... other actions
});