"use client";

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import { useTeachers } from '@/hooks/use-course-assignment';
import { useAssignmentStore } from '@/store/AssignmentStore';

export const TeacherSelector: React.FC = () => {
    const { data: teachers, isLoading } = useTeachers();
    const { selectedTeacher, setSelectedTeacher } = useAssignmentStore();

    if (isLoading) return <div className="p-4">Loading teachers...</div>;

    return (
        <div className="space-y-4">
            <Label className="text-sm font-medium">Select Teacher</Label>
            <Select
                value={selectedTeacher?.id?.toString() || ''}
                onValueChange={(value) => {
                    const teacher = teachers?.find(t => t.id === value);
                    setSelectedTeacher(teacher || null);
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                    {teachers?.map((teacher) => (
                        <SelectItem key={teacher.id} value={String(teacher.id)}>
                            <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>{String(teacher.firstName)} {String(teacher.lastName)}</span>
                                <Badge variant="secondary" className="text-xs">
                                    {String(teacher.specialization)}
                                </Badge>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {selectedTeacher && (
                <Card className="mt-4">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className="font-medium">{String(selectedTeacher.firstName)} {String(selectedTeacher.lastName)}</h4>
                                <p className="text-sm text-gray-600">{selectedTeacher.email}</p>
                                <p className="text-sm text-gray-600">{String(selectedTeacher.phone)}</p>
                                <Badge variant="outline">{String(selectedTeacher.employeeId)}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
