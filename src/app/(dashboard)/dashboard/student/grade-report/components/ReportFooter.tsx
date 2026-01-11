"use client";
import React from 'react';
import { Calendar, FileText } from 'lucide-react';
import { getSemesterName } from '@/lib/gpa.utils';

type ReportFooterProps = {
    semester: string;
    academicYear: string;
};

export const ReportFooter = React.memo(({ semester, academicYear }: ReportFooterProps) => (
    <div className="px-6 py-6 bg-gray-100 border-t">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-gray-500" />
                <h4 className="text-sm font-medium text-gray-700">Official Grade Report</h4>
            </div>

            <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                    This is an official academic transcript for <strong>{getSemesterName(semester)}</strong> of the <strong>{academicYear}</strong> academic session.
                </p>
                <p className="text-sm text-gray-600">
                    Computed using the Nigerian University 5.00 Grade Point System
                </p>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-4 pt-3 border-t border-gray-300">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Generated: {new Date().toLocaleDateString('en-NG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    <span>•</span>
                    <span>System: 5.00 Scale</span>
                    <span>•</span>
                    <span>Official Document</span>
                </div>
            </div>
        </div>
    </div>
));

ReportFooter.displayName = 'ReportFooter';
