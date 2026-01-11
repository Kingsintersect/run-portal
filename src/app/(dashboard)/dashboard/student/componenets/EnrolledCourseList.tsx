import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { getStudentGradeReport } from '../grade-report/api/studentGradeReport.api';
import { AuthUser } from '@/types/user';
import CourseCard from '@/components/ui/cards/CourseCard';
import { processGradeReport } from '@/lib/gpa.utils';
// import { GetStudentCourses } from '@/app/actions/server.admin';

interface EnrolledCourseListProps {
    student: AuthUser | null;
    url?: string;
}

const EnrolledCourseList: React.FC<EnrolledCourseListProps> = ({ student, url }) => {
    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { access_token } = useAuth();
    const shortCode = student?.level;

    useEffect(() => {
        if (!access_token || !shortCode) {
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        setIsLoading(true);
        setError(null);

        const fetchCourses = async () => {
            try {
                // const res = await GetStudentCourses(access_token, student.id, shortCode);
                if (student.email) {
                    const gradeReport = await getStudentGradeReport(student.email, access_token);
                    const updatedSampleGradeReport = processGradeReport(gradeReport);
                    if (!updatedSampleGradeReport) {
                        setError("Unable to retrieve course data");
                        return;
                    }
                    setEnrolledCourses(updatedSampleGradeReport.courses);
                } else {
                    setError("Student email is missing");
                }
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Error fetching courses:", error);
                    setError("Failed to load your enrolled courses");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
        return () => controller.abort();
    }, [access_token, student, shortCode]);

    if (isLoading) {
        return (
            <div className="w-full py-16 flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-600" />
                <p className="text-lg">Loading your enrolled courses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex flex-col items-center justify-center text-red-600 dark:text-red-400">
                <p className="text-lg font-medium">{error}</p>
                <p className="text-sm mt-2">Please try again later or contact support</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto mt-10 mb-16">
            <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex items-center">
                    <BookOpen className="h-6 w-6 mr-3 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Enrolled Courses
                    </h2>
                </div>
                <div className="text-sm px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full">
                    {enrolledCourses.length} {enrolledCourses.length === 1 ? 'Course' : 'Courses'}
                </div>
            </div>

            {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-4">
                    {enrolledCourses.map((course, index) => (
                        <div
                            key={index}
                            className="transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            <CourseCard
                                url={url}
                                image_url={course.image_url ?? "/course/opreating-systems.png"}
                                title={course.course_name}
                                code={course.course_code}
                                credit={course.credit_load}
                                instructor={course.instructor ?? null}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-16 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
                    <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                        <BookOpen className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Courses Enrolled</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        You are not currently enrolled in any courses for this study level.
                        Please contact your academic advisor for assistance.
                    </p>
                </div>
            )}
        </div>
    );
};

export default EnrolledCourseList;
