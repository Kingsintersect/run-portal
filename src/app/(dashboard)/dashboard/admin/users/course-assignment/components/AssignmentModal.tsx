"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAssignmentStore } from '@/store/AssignmentStore';
import { useAssignTeacher } from '@/hooks/use-course-assignment';
import { Plus, Users } from 'lucide-react';
import { TeacherSelector } from './TeacherSelector';
import { CourseSelector } from './CourseSelector';

export const AssignmentModal: React.FC = () => {
    const {
        selectedTeacher,
        selectedCourses,
        isAssignmentModalOpen,
        setIsAssignmentModalOpen,
        reset
    } = useAssignmentStore();

    const assignMutation = useAssignTeacher();

    const handleAssign = () => {
        if (!selectedTeacher || selectedCourses.length === 0) return;

        assignMutation.mutate(
            {
                teacherId: String(selectedTeacher.id),
                courseIds: selectedCourses.map(c => c.id)
            },
            {
                onSuccess: () => {
                    setIsAssignmentModalOpen(false);
                    reset();
                }
            }
        );
    };

    return (
        <Dialog open={isAssignmentModalOpen} onOpenChange={setIsAssignmentModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Teacher to Course
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Assign Teacher to Courses</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <TeacherSelector />
                    <CourseSelector />
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                        {selectedCourses.length} course(s) selected
                    </div>
                    <div className="flex space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={reset}>Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={handleAssign}
                            disabled={!selectedTeacher || selectedCourses.length === 0 || assignMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {assignMutation.isPending ? 'Assigning...' : 'Assign Courses'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};