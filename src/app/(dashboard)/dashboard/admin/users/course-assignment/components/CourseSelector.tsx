"use client";

import { useCourses } from "@/hooks/use-course-assignment";
import { useAssignmentStore } from "@/store/AssignmentStore";

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen } from "lucide-react";

export const CourseSelector: React.FC = () => {
    const { data: courses, isLoading } = useCourses();
    const { selectedCourses, toggleCourse } = useAssignmentStore();

    if (isLoading) return <div className="p-4">Loading courses...</div>;

    return (
        <div className="space-y-4">
            <Label className="text-sm font-medium">Select Courses</Label>
            <div className="grid gap-3 max-h-64 overflow-y-auto">
                {courses?.map((course) => (
                    <div key={course.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                            checked={selectedCourses.some(c => c.id === course.id)}
                            onCheckedChange={() => toggleCourse(course)}
                        />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-4 w-4 text-green-600" />
                                <span className="font-medium">{course.code}</span>
                                <Badge variant="secondary">{course.class}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{course.name}</p>
                            <p className="text-xs text-gray-500">{course.creditUnit} credit units • {course.term} term</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};