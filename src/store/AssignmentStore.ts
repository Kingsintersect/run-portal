import { Course, Teacher } from "@/services/TeacherCourseService";
import { create } from "zustand";

// Zustand Store (State Management)
interface AssignmentStore {
    selectedTeacher: Teacher | null;
    selectedCourses: Course[];
    isAssignmentModalOpen: boolean;
    setSelectedTeacher: (teacher: Teacher | null) => void;
    setSelectedCourses: (courses: Course[]) => void;
    toggleCourse: (course: Course) => void;
    setIsAssignmentModalOpen: (open: boolean) => void;
    reset: () => void;
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
    selectedTeacher: null,
    selectedCourses: [],
    isAssignmentModalOpen: false,
    setSelectedTeacher: (teacher) => set({ selectedTeacher: teacher }),
    setSelectedCourses: (courses) => set({ selectedCourses: courses }),
    toggleCourse: (course) => {
        const current = get().selectedCourses;
        const exists = current.find(c => c.id === course.id);
        if (exists) {
            set({ selectedCourses: current.filter(c => c.id !== course.id) });
        } else {
            set({ selectedCourses: [...current, course] });
        }
    },
    setIsAssignmentModalOpen: (open) => set({ isAssignmentModalOpen: open }),
    reset: () => set({ selectedTeacher: null, selectedCourses: [], isAssignmentModalOpen: false })
}));