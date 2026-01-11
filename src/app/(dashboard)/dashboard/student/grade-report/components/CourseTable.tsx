"use client";
import React from 'react';
import { getGradeColor, getGradePoint, calculateQualityPoints, GPACourse } from '@/lib/gpa.utils';
import { Loader2, BookOpen, Award } from 'lucide-react';

type CourseTableProps = {
    courses: GPACourse[];
};

export const CourseTable = React.memo(({ courses }: CourseTableProps) => (
    <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Course Performance Details</h3>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course Name
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Credit Units (CU)
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score (%)
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grade
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grade Points (GP)
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quality Points (QP)
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {courses.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <Loader2 className="animate-spin h-6 w-6" />
                                    <span>Loading course data...</span>
                                </div>
                            </td>
                        </tr>
                    )}
                    {courses.map((course) => {
                        const gradePoint = getGradePoint(course.grade);
                        const qualityPoints = calculateQualityPoints(course.grade, course.credit_load);

                        return (
                            <tr key={course.course_id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                    {course.course_code}
                                </td>
                                <td className="px-6 py-4 text-gray-900">
                                    <div className="max-w-xs truncate" title={course.course_name}>
                                        {course.course_name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center font-medium text-gray-900">
                                    {course.credit_load}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="font-medium text-gray-900">
                                        {/* score */}
                                        {course.finalgrade || 0}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(course.grade)}`}>
                                        {course.grade}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center font-medium text-gray-900">
                                    {gradePoint.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="font-medium text-blue-600">
                                        {qualityPoints.toFixed(2)}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                    {courses.length > 0 && (
                        <tr className="bg-blue-50 font-semibold">
                            <td colSpan={2} className="px-6 py-4 text-right text-gray-900">
                                <div className="flex items-center justify-end gap-2">
                                    <Award className="h-4 w-4" />
                                    <span>TOTALS:</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center text-blue-700">
                                {courses.reduce((sum, course) => sum + course.credit_load, 0)}
                            </td>
                            <td className="px-6 py-4 text-center text-gray-500">-</td>
                            <td className="px-6 py-4 text-center text-gray-500">-</td>
                            <td className="px-6 py-4 text-center text-gray-500">-</td>
                            <td className="px-6 py-4 text-center text-blue-700">
                                {courses.reduce((sum, course) =>
                                    sum + calculateQualityPoints(course.grade, course.credit_load), 0
                                ).toFixed(2)}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {courses.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                    <strong>Formula:</strong> GPA = Total Quality Points (TQP) ÷ Total Credit Units (TCU)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                    <strong>Quality Points:</strong> Grade Point × Credit Units for each course
                </p>
            </div>
        )}
    </div>
));

CourseTable.displayName = 'CourseTable';
