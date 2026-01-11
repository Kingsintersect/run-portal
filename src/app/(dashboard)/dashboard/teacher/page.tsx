import React from 'react';
import {
    BookOpen,
    FileText,
    Trophy,
    Users,
    AlertCircle,
    Activity,
    BarChart3
} from 'lucide-react';
import { StatCard } from './components/StatCard';
import { WelcomeBlock } from './components/WelcomeBlock';

type Course = { id: number; name: string; students: number; progress: number };
const TeacherDashboard = () => {

    const courses: Course[] = [
        { id: 1, name: 'Mathematics 101', students: 32, progress: 78 },
        { id: 2, name: 'Physics Advanced', students: 24, progress: 65 },
        { id: 3, name: 'Chemistry Basics', students: 28, progress: 82 }
    ];

    const recentActivities = [
        { type: 'assignment', student: 'John Doe', course: 'Mathematics 101', action: 'submitted assignment', time: '2 hours ago' },
        { type: 'grade', student: 'Sarah Smith', course: 'Physics Advanced', action: 'graded quiz', time: '3 hours ago' },
        { type: 'discussion', student: 'Mike Johnson', course: 'Chemistry Basics', action: 'posted in discussion', time: '5 hours ago' }
    ];

    const upcomingDeadlines = [
        { title: 'Grade Physics Midterm', date: '2025-07-12', course: 'Physics Advanced' },
        { title: 'Post Math Assignment', date: '2025-07-15', course: 'Mathematics 101' },
        { title: 'Chemistry Lab Review', date: '2025-07-18', course: 'Chemistry Basics' }
    ];

    return (
        <div className="space-y-6">
            <WelcomeBlock />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value="84"
                    icon={Users}
                    color="#3b82f6"
                    trend="+12% this month"
                />
                <StatCard
                    title="Active Courses"
                    value="3"
                    icon={BookOpen}
                    color="#10b981"
                    trend="+12% this month"
                />
                <StatCard
                    title="Pending Assignments"
                    value="15"
                    icon={FileText}
                    color="#f59e0b"
                    trend="+12% this month"
                />
                <StatCard
                    title="Average Grade"
                    value="85%"
                    icon={Trophy}
                    color="#8b5cf6"
                    trend="+3% from last term"
                />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Deadlines</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {upcomingDeadlines.map((deadline, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-2 mb-2">
                                <AlertCircle size={16} className="text-orange-500" />
                                <h3 className="font-semibold text-gray-900">{deadline.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{deadline.course}</p>
                            <p className="text-xs text-gray-500">{deadline.date}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Course Performance</h2>
                        <BarChart3 size={20} className="text-green-500" />
                    </div>
                    <div className="space-y-4">
                        {courses.map((course, index) => (
                            <div key={course.id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">{course.name}</span>
                                    <span className="text-sm text-gray-600">{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${index === 0 ? 'bg-blue-500' :
                                            index === 1 ? 'bg-green-500' : 'bg-purple-500'
                                            }`}
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t">
                        <select className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Fall 2025</option>
                            <option>Spring 2025</option>
                            <option>Summer 2025</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Activity size={16} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.student}</p>
                                    <p className="text-xs text-gray-600">{activity.action} in {activity.course}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;