"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, User, BookOpen, Calendar } from 'lucide-react';
import { useAssignments, useRemoveAssignment } from '@/hooks/use-course-assignment';

export const AssignmentsList: React.FC = () => {
    const { data: assignments, isLoading } = useAssignments();
    const removeMutation = useRemoveAssignment();

    if (isLoading) {
        return (
            <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (!assignments || assignments.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No teacher-course assignments yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Click "Assign Teacher to Course" to get started.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {assignments.map((assignment) => (
                <Card key={assignment.id}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">
                                        {String(assignment.teacher.firstName)} {String(assignment.teacher.lastName)}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{String(assignment.teacher.specialization)}</p>
                                    <div className="mt-3 flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <BookOpen className="h-4 w-4 text-green-600" />
                                            <span className="font-medium">{assignment.course.code}</span>
                                        </div>
                                        <Badge variant="secondary">{assignment.course.class}</Badge>
                                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            <span>Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{assignment.course.name}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeMutation.mutate(assignment.id)}
                                disabled={removeMutation.isPending}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};