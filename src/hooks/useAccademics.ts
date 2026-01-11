import { remoteApiUrl } from "@/config";
import { useQuery } from "@tanstack/react-query";

export type AccademicSessions = {
    id: number;
    name: string;
    // startYear: string;
    // endYear: string;
    status: "ACTIVE" | "INACTIVE";
};
export type AccademicSemesters = {
    id: number;
    name: string;
    status: "ACTIVE" | "INACTIVE";
};
const academicsApi = {
    getAcademicSessions: async (): Promise<AccademicSessions[]> => {
        const response = await fetch(`${remoteApiUrl}/all-sessions`);
        if (!response.ok) {
            throw new Error('Failed to fetch academic sessions');
        }
        const data = await response.json();
        return data.data
    },
    // getAcademicYears: async () => {
    //     const response = await fetch('/api/academics/years');
    //     if (!response.ok) {
    //         throw new Error('Failed to fetch academic years');
    //     }
    //     return response.json();
    // },
    // getNextSession: async () => {
    //     await new Promise(resolve => setTimeout(resolve, 300));
    //     return {
    //         academicYear: '2024/2025',
    //         semester: 'First Semester'
    //     };
    // },
    getCurrentSession: async (): Promise<AccademicSessions> => {
        const allAcademicSessions = await academicsApi.getAcademicSessions();
        if (!allAcademicSessions || allAcademicSessions.length === 0) {
            throw new Error('No current academic session found');
        }
        const currentSession = allAcademicSessions.filter((item) => item.status === "ACTIVE")[0]; // Get the first active session
        return currentSession
    },
    getCurrentSemester: async (): Promise<AccademicSemesters> => {
        const response = await fetch(`${remoteApiUrl}/academic-semester`);
        if (!response.ok) {
            throw new Error('Failed to fetch academic sessions');
        }
        const allSemester = await response.json();
        const currentSemester = allSemester.data.filter((item) => item.status === "ACTIVE")[0];
        return currentSemester
    },

}

export const useCurrentSession = () => {
    return useQuery({
        queryKey: ['academic-info-currentSession'],
        queryFn: academicsApi.getCurrentSession,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
    });
};

export const useCurrentSemester = () => {
    return useQuery({
        queryKey: ['academic-info-currentSemester'],
        queryFn: academicsApi.getCurrentSemester,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
    });
};