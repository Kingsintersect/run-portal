"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as XLSX from "xlsx";
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2Icon, FileArchive, FileAxis3D, Loader2, Upload } from 'lucide-react';
import { fetchStudentScores, publishScores } from '@/app/actions/admin';
import { useAuth } from '@/contexts/AuthContext';
import { ScoreAnalytics } from '@/app/(dashboard)/dashboard/admin/students-grade-report/components/ScoreAnalytics';
import { StudentScoresTable } from '@/app/(dashboard)/dashboard/admin/students-grade-report/components/StudentScoresTable';
import { useParams } from 'next/navigation';
import StudentTableSearchBlock from './StudentTableSearchBlock';

export type ActivityType = "assign" | "quiz" | "exam" | string;
export type StudentActivity = {
    activity_name: string;
    type: ActivityType;
    grade: string;
    max_grade: string;
};
export type StudentScore = {
    student_id: number;
    student_email: string;
    student_username: string;
    final_grade: number;
    letter_grade: string;
    credit_load: number;
    quality_points: number;
    activities: StudentActivity[];
};
const getLetterGrade = (score: number): string => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    if (score >= 40) return "E";
    return "F";
};

const StudentsInCourse = () => {
    const params = useParams();
    const CourseId = "27";
    const queryClient = useQueryClient();
    const { access_token } = useAuth();

    const {
        data: studentscores = [],
        isLoading: scoresLoading,
        error: scoresError
    } = useQuery({
        queryKey: ['student-scores-in-a-course', CourseId],
        queryFn: () => fetchStudentScores(CourseId, access_token!),
        enabled: typeof CourseId === "string" && CourseId.trim() !== "" && !!access_token?.trim()
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const rawScores = Array.isArray(studentscores)
        ? studentscores
        : Array.isArray(studentscores?.students)
            ? studentscores.students
            : [];

    const enhancedScores = rawScores.map(student => ({
        ...student,
        computedGrade: getLetterGrade(student.final_grade),
    }));

    const filteredStudents = enhancedScores.filter(student => {
        const matchesSearch =
            student.student_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.student_email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' || student.computedGrade === filterStatus;

        return matchesSearch && matchesFilter;
    });


    // Mutations
    const publishMutation = useMutation({
        mutationFn: ({ courseId, access_token }: { courseId: string | number; access_token: string }) =>
            publishScores(courseId, access_token),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentScores', CourseId] });
        },
    });

    const handlePublishScores = () => {
        if (typeof access_token === "string" && access_token.trim() !== "") {
            publishMutation.mutate({ courseId: CourseId, access_token });
        } else {
            console.warn("Access token is missing or invalid.");
        }
    };

    // if (!access_token) return (
    //     <NoAccessTokenBlock />
    // );

    const exportToCSV = () => {
        const csvContent = convertToCSV(filteredStudents);
        downloadFile(csvContent, "results.csv", "text/csv");
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredStudents);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Results");
        XLSX.writeFile(wb, "results.xlsx");
    };
    // Helper functions for export
    const convertToCSV = (data: StudentScore[]) => {
        const headers = [
            "Student ID",
            "Email",
            "Username",
            "Final Grade",
            "Letter Grade",
        ];
        const rows = data.map((student) => [
            student.student_id,
            student.student_email,
            student.student_username,
            student.final_grade,
            student.letter_grade,
        ]);

        return [headers, ...rows].map((row) => row.join(",")).join("\n");
    };

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex justify-between items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button onClick={exportToCSV} className="gap-2  bg-cyan-500 hover:bg-cyan-700 text-white">
                                <FileArchive className="h-4 w-4" />
                                Export Results (CSV)
                            </Button>
                            <Button onClick={exportToExcel} className="gap-2 bg-pink-500 hover:bg-pink-700 text-white">
                                <FileAxis3D className="h-4 w-4" />
                                Export Results (Excel)
                            </Button>
                        </div>
                    </div>
                </div>

                {CourseId && (
                    <Button
                        onClick={handlePublishScores}
                        //  disabled={unpublishedCount === 0 || publishMutation.isPending}
                        disabled={publishMutation.isPending}
                        className="gap-2"
                    >
                        {publishMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                        Publish Scores 0...
                        {/* Publish Scores ({unpublishedCount}) */}
                    </Button>
                )}
            </div>

            <hr className='my-10 bg-site-a-dark' />

            {publishMutation.isSuccess && (
                <Alert className="border-green-500 bg-green-50 text-green-800">
                    <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                    <AlertTitle>Success! Your changes have been saved</AlertTitle>
                    <AlertDescription className='text-site-a'>
                        Successfully published {rawScores.length} student scores!
                        {/* Successfully published {publishMutation.data.publishedCount} student scores! */}
                    </AlertDescription>
                </Alert>
            )}

            {CourseId && (
                <>
                    {scoresLoading ? (
                        <Card>
                            <CardContent className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="ml-2">Loading student scores...</span>
                            </CardContent>
                        </Card>
                    ) : scoresError ? (
                        <Alert variant={"destructive"}>
                            <AlertDescription>
                                Error loading student scores. Please try again.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <ScoreAnalytics scores={filteredStudents} />
                            <StudentTableSearchBlock
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                filterStatus={filterStatus}
                                setFilterStatus={setFilterStatus}
                            />
                            <StudentScoresTable scores={filteredStudents} />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default StudentsInCourse;