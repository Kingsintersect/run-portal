import { AuthUser } from "@/types/user";

export type Teacher = AuthUser | {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialization: string;
    employeeId: string;
    status: 'active' | 'inactive';
};

export interface Course {
    id: string;
    code: string;
    name: string;
    description: string;
    class: string;
    creditUnit: number;
    term: 'first' | 'second';
    academicYear: string;
}
export interface TeacherCourseAssignment {
    id: string;
    teacherId: string;
    courseId: string;
    assignedDate: string;
    status: 'active' | 'inactive';
    teacher: AuthUser;
    course: Course;
}

// API Service Layer (Separation of Concerns)
class TeacherCourseService {
    private baseUrl = '/api';

    async getTeachers(): Promise<Teacher[]> {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [
            {
                id: '1',
                firstName: 'Adebayo',
                lastName: 'Okonkwo',
                email: 'adebayo.okonkwo@school.edu.ng',
                phone: '+234-803-123-4567',
                specialization: 'Mathematics',
                employeeId: 'TCH001',
                status: 'active'
            },
            {
                id: '2',
                firstName: 'Fatima',
                lastName: 'Bello',
                email: 'fatima.bello@school.edu.ng',
                phone: '+234-805-987-6543',
                specialization: 'English Language',
                employeeId: 'TCH002',
                status: 'active'
            },
            {
                id: '3',
                firstName: 'Chioma',
                lastName: 'Okere',
                email: 'chioma.okere@school.edu.ng',
                phone: '+234-807-555-1234',
                specialization: 'Physics',
                employeeId: 'TCH003',
                status: 'active'
            }
        ];
    }

    async getCourses(): Promise<Course[]> {
        await new Promise(resolve => setTimeout(resolve, 800));
        return [
            {
                id: '1',
                code: 'MTH101',
                name: 'Further Mathematics',
                description: 'Advanced mathematical concepts for senior students',
                class: 'SS3',
                creditUnit: 3,
                term: 'first',
                academicYear: '2024/2025'
            },
            {
                id: '2',
                code: 'ENG201',
                name: 'Literature in English',
                description: 'Study of English literature and composition',
                class: 'SS2',
                creditUnit: 2,
                term: 'first',
                academicYear: '2024/2025'
            },
            {
                id: '3',
                code: 'PHY301',
                name: 'Applied Physics',
                description: 'Practical applications of physics principles',
                class: 'SS3',
                creditUnit: 4,
                term: 'second',
                academicYear: '2024/2025'
            }
        ];
    }

    async getAssignments(): Promise<TeacherCourseAssignment[]> {
        await new Promise(resolve => setTimeout(resolve, 600));
        const teachers = await this.getTeachers();
        const courses = await this.getCourses();

        return [
            {
                id: '1',
                teacherId: '1',
                courseId: '1',
                assignedDate: '2024-09-01',
                status: 'active',
                teacher: teachers[0] as AuthUser,
                course: courses[0]
            }
        ];
    }

    async assignTeacherToCourses(teacherId: string, courseIds: string[]): Promise<void> {
        console.log('teacherId', teacherId)
        console.log('courseIds', courseIds)
        await new Promise(resolve => setTimeout(resolve, 1200));
        // Simulate potential error
        if (Math.random() < 0.1) {
            throw new Error('Assignment failed. Please try again.');
        }
    }

    async removeAssignment(assignmentId: string): Promise<void> {
        console.log('assignmentId', assignmentId)
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

// Service instance
export const teacherCourseService = new TeacherCourseService();