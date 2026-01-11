import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignmentModal } from "./components/AssignmentModal";
import { Users } from "lucide-react";
import { AssignmentsList } from "./components/AssignmentsList";

const TeacherCourseAssignment: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Teacher Course Assignment</h1>
                    <p className="text-gray-600 mt-2">Manage teacher assignments to courses for the academic year</p>
                </div>
                <AssignmentModal />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Current Assignments</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AssignmentsList />
                </CardContent>
            </Card>
        </div>
    );
};

export default TeacherCourseAssignment;