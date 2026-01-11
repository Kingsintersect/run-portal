// Service instance

import { teacherCourseService } from "@/services/TeacherCourseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Custom Hooks (Business Logic Layer)
export const useTeachers = () => {
    return useQuery({
        queryKey: ['teachers'],
        queryFn: () => teacherCourseService.getTeachers(),
        staleTime: 5 * 60 * 1000 // 5 minutes
    });
};

export const useCourses = () => {
    return useQuery({
        queryKey: ['courses'],
        queryFn: () => teacherCourseService.getCourses(),
        staleTime: 5 * 60 * 1000
    });
};

export const useAssignments = () => {
    return useQuery({
        queryKey: ['assignments'],
        queryFn: () => teacherCourseService.getAssignments(),
        staleTime: 2 * 60 * 1000 // 2 minutes
    });
};

export const useAssignTeacher = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ teacherId, courseIds }: { teacherId: string; courseIds: string[] }) =>
            teacherCourseService.assignTeacherToCourses(teacherId, courseIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            toast.success('Teacher assigned to courses successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to assign teacher');
        }
    });
};

export const useRemoveAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (assignmentId: string) => teacherCourseService.removeAssignment(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            toast.success('Assignment removed successfully!');
        },
        onError: () => {
            toast.error('Failed to remove assignment');
        }
    });
};