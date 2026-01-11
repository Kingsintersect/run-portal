import { BookOpen, Clock, Award, FileText } from "lucide-react";
import { StatCard } from "../../components/StatCard";
import { CalendarWidget } from "../../components/calendar-widget";
import { CourseProgress } from "../../components/course-progress";
import { UpcomingAssignments } from "../../components/upcoming-assignments";

export default function DashboardPage() {
    const today = new Date();

    const events = [
        {
            id: "1",
            title: "Advanced Calculus Lecture",
            time: "9:00 AM",
            type: "class" as const,
        },
        {
            id: "2",
            title: "Term Paper Submission",
            time: "11:00 AM",
            type: "assignment" as const,
        },
        {
            id: "3",
            title: "Study Group Meeting",
            time: "2:30 PM",
            type: "meeting" as const,
        },
        {
            id: "4",
            title: "Physics Mid-term Exam",
            time: "4:00 PM",
            type: "exam" as const,
        },
    ];

    const courses = [
        {
            id: "1",
            name: "Advanced Calculus",
            code: "MATH 301",
            progress: 75,
            instructor: "Dr. Smith",
        },
        {
            id: "2",
            name: "Physics II",
            code: "PHYS 202",
            progress: 60,
            instructor: "Dr. Johnson",
        },
        {
            id: "3",
            name: "Introduction to AI",
            code: "CS 415",
            progress: 85,
            instructor: "Prof. Williams",
        },
        {
            id: "4",
            name: "Modern Literature",
            code: "LIT 205",
            progress: 45,
            instructor: "Dr. Davis",
        },
    ];

    const assignments = [
        {
            id: "1",
            title: "Term Paper: Quantum Mechanics",
            course: "PHYS 202",
            dueDate: "Today",
            status: "in-progress" as const,
        },
        {
            id: "2",
            title: "Problem Set 5",
            course: "MATH 301",
            dueDate: "Tomorrow",
            status: "not-started" as const,
        },
        {
            id: "3",
            title: "Literary Analysis Essay",
            course: "LIT 205",
            dueDate: "May 10",
            status: "not-started" as const,
        },
        {
            id: "4",
            title: "AI Project Proposal",
            course: "CS 415",
            dueDate: "May 12",
            status: "completed" as const,
        },
    ];

    return (
        <div>
            <main className="ml-64 pt-16 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Current GPA"
                            value="3.85"
                            icon={<Award className="h-6 w-6" />}
                            trend={{ value: 0.2, positive: true }}
                        />
                        <StatCard
                            title="Courses"
                            value="6"
                            icon={<BookOpen className="h-6 w-6" />}
                        />
                        <StatCard
                            title="Attendance"
                            value="95%"
                            icon={<Clock className="h-6 w-6" />}
                            trend={{ value: 2, positive: true }}
                        />
                        <StatCard
                            title="Assignments Due"
                            value="8"
                            icon={<FileText className="h-6 w-6" />}
                            trend={{ value: 3, positive: false }}
                        />
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <CalendarWidget date={today} events={events} />
                            <CourseProgress courses={courses} />
                        </div>
                        <div>
                            <UpcomingAssignments assignments={assignments} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}