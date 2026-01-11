"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StudentScore } from "../page";

const gradeColorMap = {
    A: "bg-blue-500",
    B: "bg-green-500",
    C: "bg-yellow-500",
    D: "bg-red-500",
    F: "bg-gray-500",
};
// export const getScoreGrade = (score, maxScore) => {
//     const percentage = (score / maxScore) * 100;
//     if (percentage >= 90) return { grade: 'A', color: 'bg-green-500' };
//     if (percentage >= 80) return { grade: 'B', color: 'bg-blue-500' };
//     if (percentage >= 70) return { grade: 'C', color: 'bg-yellow-500' };
//     if (percentage >= 60) return { grade: 'D', color: 'bg-orange-500' };
//     return { grade: 'F', color: 'bg-red-500' };
// };

// Categorize activity by real type
const categorizeActivities = (activities: StudentScore["activities"]) => {
    let quizTotal = 0;
    let assignTotal = 0;
    let examTotal = 0;

    activities.forEach((a) => {
        const type = a.type.toLowerCase();
        const name = a.activity_name.toLowerCase();

        const grade = parseFloat(a.grade);

        if (type === "assign") {
            assignTotal += grade;
        } else if (type === "quiz") {
            if (name.includes("exam")) {
                examTotal += grade;
            } else {
                quizTotal += grade;
            }
        }
    });

    // const getPercent = (total: number, max: number) =>
    //     max > 0 ? `${Math.round((total / max) * 100)}%` : "0%";

    return {
        assignment: assignTotal,
        quiz: quizTotal,
        exam: examTotal,
    };
};

export const StudentScoresTable = ({ scores }: { scores: StudentScore[] }) => {
    if (!scores?.length) {
        return (
            <Card>
                <CardContent className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                        No students found for this department
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Student Scores</CardTitle>
                <CardDescription>Breakdown by assessment type</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Assignment</TableHead>
                            <TableHead>Quiz</TableHead>
                            <TableHead>Exam</TableHead>
                            <TableHead>Total (%)</TableHead>
                            <TableHead>Grade</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scores.map((student, i) => {
                            const grade = student.letter_grade || "F";
                            const color =
                                gradeColorMap[grade as keyof typeof gradeColorMap] || "bg-gray-400";

                            const { assignment, quiz, exam } = categorizeActivities(
                                student.activities
                            );

                            return (
                                <TableRow key={i}>
                                    <TableCell>
                                        <div className="font-medium">{student.student_email}</div>
                                    </TableCell>
                                    <TableCell>{student.student_username}</TableCell>
                                    <TableCell>{assignment}</TableCell>
                                    <TableCell>{quiz}</TableCell>
                                    <TableCell>{exam}</TableCell>
                                    <TableCell>
                                        {Math.round(student.final_grade)}%
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={`${color} text-white`}>
                                            {grade}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

