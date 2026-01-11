
// Mock data
export const courseData = {
    title: "Advanced React Development",
    code: "CS 4850",
    description: "An in-depth exploration of React ecosystem including hooks, context, performance optimization, and advanced patterns. Students will build complex applications and learn industry best practices.",
    instructor: {
        name: "Dr. Sarah Mitchell",
        email: "s.mitchell@university.edu",
        office: "Computer Science Building, Room 314",
        officeHours: "Monday & Wednesday 2:00-4:00 PM"
    },
    schedule: {
        days: "Monday, Wednesday, Friday",
        time: "10:00 AM - 11:15 AM",
        location: "Tech Hall 201",
        credits: 3
    },
    semester: "Fall 2024",
    enrolled: 24,
    capacity: 30
};
export const getStatusColor = (status) => {
    switch (status) {
        case 'active': return 'text-green-600 bg-green-100';
        case 'warning': return 'text-yellow-600 bg-yellow-100';
        case 'completed': return 'text-blue-600 bg-blue-100';
        case 'upcoming': return 'text-purple-600 bg-purple-100';
        default: return 'text-gray-600 bg-gray-100';
    }
};

type Course = { id: number; name: string; students: number; progress: number };
export const courses: Course[] = [
    { id: 27, name: 'LAW 111 - Introduction to Nigerian Law 1', students: 32, progress: 78 },
    { id: 26, name: '"ECO 101 - Principles of Economics 1', students: 24, progress: 65 },
    { id: 31, name: 'CSC 111 - Introduction to Computer And Information Technology', students: 28, progress: 82 }
];