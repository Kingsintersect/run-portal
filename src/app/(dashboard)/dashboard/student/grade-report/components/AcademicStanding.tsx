"use client";
import React from 'react';
import { AcademicStanding as AcademicStandingType } from '@/lib/gpa.utils';
import { Trophy, TrendingUp } from 'lucide-react';

type AcademicStandingProps = {
    gpa: number;
    degreeClass: string;
    academicStanding: AcademicStandingType;
};

export const AcademicStanding = React.memo(({
    gpa,
    degreeClass,
    academicStanding
}: AcademicStandingProps) => {
    // Calculate progress percentage for 5.00 scale
    const progressPercentage = (gpa / 5.0) * 100;

    const getProgressColor = (gpa: number) => {
        if (gpa >= 4.5) return 'bg-green-500';
        if (gpa >= 3.5) return 'bg-blue-500';
        if (gpa >= 2.4) return 'bg-yellow-500';
        if (gpa >= 1.5) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getNextTarget = (currentGPA: number) => {
        if (currentGPA < 1.5) return { target: 1.5, label: 'Third Class' };
        if (currentGPA < 2.4) return { target: 2.4, label: 'Second Class Lower' };
        if (currentGPA < 3.5) return { target: 3.5, label: 'Second Class Upper' };
        if (currentGPA < 4.5) return { target: 4.5, label: 'First Class' };
        return { target: 5.0, label: 'Perfect Score' };
    };

    const nextTarget = getNextTarget(gpa);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <h4 className="font-semibold text-gray-800">Academic Performance</h4>
            </div>

            <div className="space-y-4">
                {/* Current GPA Display */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-800 mb-1">{gpa}</div>
                    <div className="text-sm text-gray-600">Current GPA</div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${academicStanding.color.replace('text-', 'bg-').replace('-600', '-100')} ${academicStanding.color}`}>
                        {degreeClass}
                    </div>
                </div>

                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress on 5.00 Scale</span>
                        <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all duration-700 ${getProgressColor(gpa)}`}
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.00</span>
                        <span>2.50</span>
                        <span>5.00</span>
                    </div>
                </div>

                {/* Grade Scale Reference */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span className="text-green-600">4.50-5.00:</span>
                            <span>First Class</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-blue-600">3.50-4.49:</span>
                            <span>2nd Class Upper</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-yellow-600">2.40-3.49:</span>
                            <span>2nd Class Lower</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span className="text-orange-600">1.50-2.39:</span>
                            <span>Third Class</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">1.00-1.49:</span>
                            <span>Pass</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-red-600">Below 1.00:</span>
                            <span>Fail</span>
                        </div>
                    </div>
                </div>

                {/* Next Target */}
                {gpa < 5.0 && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Next Target</span>
                        </div>
                        <div className="text-sm text-blue-700">
                            Achieve <strong>{nextTarget.target.toFixed(2)} GPA</strong> for <strong>{nextTarget.label}</strong>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                            Gap: {(nextTarget.target - gpa).toFixed(2)} points
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

AcademicStanding.displayName = 'AcademicStanding';
