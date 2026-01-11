
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

export const resourcesData = [
    { id: 1, name: "React Documentation Guide", type: "pdf", size: "2.4 MB", uploadDate: "2024-09-01" },
    { id: 2, name: "Hooks Introduction Video", type: "video", size: "45 MB", uploadDate: "2024-09-05" },
    { id: 3, name: "Official React Docs", type: "link", url: "https://reactjs.org", uploadDate: "2024-09-01" },
    { id: 4, name: "Context API Examples", type: "pdf", size: "1.8 MB", uploadDate: "2024-09-15" },
    { id: 5, name: "Performance Best Practices", type: "video", size: "38 MB", uploadDate: "2024-09-20" }
];

export const studentsData = [
    { id: 1, name: "Alice Johnson", email: "alice.j@student.edu", attendance: "95%", grade: "A", status: "active" },
    { id: 2, name: "Bob Smith", email: "bob.s@student.edu", attendance: "88%", grade: "B+", status: "active" },
    { id: 3, name: "Carol Davis", email: "carol.d@student.edu", attendance: "92%", grade: "A-", status: "active" },
    { id: 4, name: "David Wilson", email: "david.w@student.edu", attendance: "76%", grade: "C+", status: "warning" },
    { id: 5, name: "Emma Brown", email: "emma.b@student.edu", attendance: "100%", grade: "A", status: "active" },
    { id: 6, name: "Frank Miller", email: "frank.m@student.edu", attendance: "84%", grade: "B", status: "active" },
    { id: 7, name: "Grace Lee", email: "grace.l@student.edu", attendance: "90%", grade: "A-", status: "active" },
    { id: 8, name: "Henry Taylor", email: "henry.t@student.edu", attendance: "68%", grade: "C", status: "warning" }
];

type Course = { id: number; name: string; students: number; progress: number };
export const courses: Course[] = [
    { id: 27, name: 'LAW 111 - Introduction to Nigerian Law 1', students: 32, progress: 78 },
    { id: 26, name: '"ECO 101 - Principles of Economics 1', students: 24, progress: 65 },
    { id: 31, name: 'CSC 111 - Introduction to Computer And Information Technology', students: 28, progress: 82 }
];