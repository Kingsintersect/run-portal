"use client";
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { GPACourse } from '@/lib/gpa.utils';

type GradeDistributionProps = {
    courses: GPACourse[];
};

export const GradeDistribution = React.memo(({ courses }: GradeDistributionProps) => {
    const gradeAnalysis = React.useMemo(() => {
        const gradeData = [
            { grade: 'A', name: 'Excellent (70-100%)', color: 'bg-green-500', textColor: 'text-green-600' },
            { grade: 'B', name: 'Very Good (60-69%)', color: 'bg-blue-500', textColor: 'text-blue-600' },
            { grade: 'C', name: 'Good (50-59%)', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
            { grade: 'D', name: 'Fair (45-49%)', color: 'bg-orange-500', textColor: 'text-orange-600' },
            { grade: 'E', name: 'Pass (40-44%)', color: 'bg-gray-500', textColor: 'text-gray-600' },
            { grade: 'F', name: 'Fail (0-39%)', color: 'bg-red-500', textColor: 'text-red-600' },
        ];

        return gradeData.map(gradeInfo => {
            const count = courses.filter(course =>
                course.grade.toUpperCase() === gradeInfo.grade
            ).length;
            const percentage = courses.length > 0 ? (count / courses.length) * 100 : 0;

            return {
                ...gradeInfo,
                count,
                percentage: Math.round(percentage)
            };
        });
    }, [courses]);

    const maxCount = Math.max(...gradeAnalysis.map(g => g.count), 1);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Grade Distribution Analysis</h4>
            </div>

            <div className="space-y-3">
                {gradeAnalysis.map(({ grade, name, color, textColor, count, percentage }) => (
                    <div key={grade} className="flex items-center space-x-3">
                        <div className="w-8 text-center">
                            <span className="font-bold text-gray-700">{grade}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">{name}</span>
                                <span className={`text-sm font-medium ${textColor}`}>
                                    {count} ({percentage}%)
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${color}`}
                                    style={{ width: `${(count / maxCount) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Courses:</span>
                    <span className="font-medium">{courses.length}</span>
                </div>
            </div>
        </div>
    );
});

GradeDistribution.displayName = 'GradeDistribution';
