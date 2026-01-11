"use client";

import { useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Award, TrendingUp } from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
} from "recharts";
import { StudentScore } from "../page";

const gradeColorMap = {
    A: "#3b82f6", // blue-500
    B: "#10b981", // green-500
    C: "#f59e0b", // amber-500
    D: "#ef4444", // red-500
    F: "#6b7280", // gray-500
};
type ScoreAnalytics = {
    scores: StudentScore[];
};
export const ScoreAnalytics = ({ scores }: ScoreAnalytics) => {
    const analytics = useMemo(() => {
        if (!scores?.length) return null;

        // Grade Distribution
        const gradeDistribution = scores.reduce((acc, student) => {
            const grade = student.letter_grade || "F";
            acc[grade] = (acc[grade] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Average Score
        const averageScore =
            scores.reduce((sum, student) => sum + (student.final_grade || 0), 0) /
            scores.length;

        // Grade bar data
        const barData = Object.entries(gradeDistribution).map(
            ([grade, count]) => ({
                name: `Grade ${grade}`,
                value: count,
                fill: gradeColorMap[grade as keyof typeof gradeColorMap] || "#000",
            })
        );

        // Pie chart data
        const pieData = barData;

        return {
            averageScore,
            pieData,
            barData,
            totalStudents: scores.length,
        };
    }, [scores]);

    if (!analytics) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Grade Breakdown
                    </CardTitle>
                    <CardDescription>Student count per grade</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={analytics.barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="value">
                                {analytics.barData.map((entry, index) => (
                                    <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Performance Summary
                    </CardTitle>
                    <CardDescription>Overall class performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">
                                {Math.round(analytics.averageScore)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Class Average
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{analytics.totalStudents}</div>
                            <div className="text-sm text-muted-foreground">
                                Total Students
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                            <Pie
                                data={analytics.pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                dataKey="value"
                            >
                                {analytics.pieData.map((entry, index) => (
                                    <Cell key={`pie-cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};
