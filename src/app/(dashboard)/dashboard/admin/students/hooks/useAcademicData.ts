import { useEffect } from 'react';
import { useStudentStore } from '../store/useStudentStore';
import { ApiClient } from '../lib/api-client';

export function useAcademicData() {
    const {
        academicSessions,
        semesters,
        departments,
        fetchAcademicData,
        filters,
        setFilters
    } = useStudentStore();

    // Fetch academic data on mount
    useEffect(() => {
        fetchAcademicData();
    }, []);

    // Fetch semesters when academic session changes
    useEffect(() => {
        const fetchSemestersForSession = async () => {
            if (filters.academic_session_id) {
                try {
                    const response = await ApiClient.getSemestersBySession(
                        filters.academic_session_id
                    );
                    if (response.success) {
                        useStudentStore.setState({ semesters: response.data });

                        // Auto-select first semester if current selection is invalid
                        const currentSemester = semesters.find(s => s.id === filters.semester_id);
                        if (!currentSemester && response.data.length > 0) {
                            setFilters({ semester_id: response.data[0].id });
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch semesters:', error);
                }
            }
        };

        fetchSemestersForSession();
    }, [filters.academic_session_id, filters.semester_id, semesters, setFilters]);

    return {
        academicSessions,
        semesters,
        departments,
        isLoading: academicSessions.length === 0,
    };
}