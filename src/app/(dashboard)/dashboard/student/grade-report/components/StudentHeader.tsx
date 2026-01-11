"use client";
import React from 'react';
import { getSemesterName, GPAGradeReport } from '@/lib/gpa.utils';

type StudentHeaderProps = {
    gradeReport: GPAGradeReport;
    gpa: number;
    totalCredits: number;
    totalQualityPoints: number;
    degreeClass: string;
};

export const StudentHeader = React.memo(({
    gradeReport,
    gpa,
    totalCredits,
    totalQualityPoints,
    degreeClass
}: StudentHeaderProps) => (
    <div className="brown-burgundy text-white p-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">Student Grade Report</h1>
                <p className="text-blue-100">
                    {getSemesterName(gradeReport.semester)} - {gradeReport.academicYear}
                </p>
                <p className="text-blue-200 text-sm mt-1">
                    Nigerian University 5.00 Grading System
                </p>
            </div>
            <div className="text-right space-y-1">
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-2xl text-yellow-300 font-bold flex items-center gap-2">
                        <span>⭐</span>
                        <span>GPA: {gpa}</span>
                    </p>
                    <p className="text-green-200 font-medium">{degreeClass}</p>
                </div>
                <div className="text-blue-100 text-sm space-y-1">
                    <p>Total Credits (TCU): {totalCredits}</p>
                    <p>Quality Points (TQP): {totalQualityPoints.toFixed(2)}</p>
                </div>
            </div>
        </div>
    </div>
));

StudentHeader.displayName = 'StudentHeader';
