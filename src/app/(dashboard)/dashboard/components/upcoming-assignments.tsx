interface Assignment {
    id: string;
    title: string;
    course: string;
    dueDate: string;
    status: 'completed' | 'in-progress' | 'not-started';
}

interface UpcomingAssignmentsProps {
    assignments: Assignment[];
}

export function UpcomingAssignments({ assignments }: UpcomingAssignmentsProps) {
    const getStatusBadge = (status: Assignment['status']) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium dark:bg-green-900 dark:text-green-300">
                        Completed
                    </span>
                );
            case 'in-progress':
                return (
                    <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-medium dark:bg-amber-900 dark:text-amber-300">
                        In Progress
                    </span>
                );
            case 'not-started':
                return (
                    <span className="px-2 py-1 rounded-md bg-red-100 text-red-800 text-xs font-medium dark:bg-red-900 dark:text-red-300">
                        Not Started
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-card rounded-xl p-6 border shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Upcoming Assignments</h3>

            <div className="space-y-3">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 rounded-md border">
                        <div>
                            <h4 className="font-medium">{assignment.title}</h4>
                            <p className="text-xs text-muted-foreground">{assignment.course}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-sm">{assignment.dueDate}</p>
                            {getStatusBadge(assignment.status)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}