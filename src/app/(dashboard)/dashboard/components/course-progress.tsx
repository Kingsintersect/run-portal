interface CourseProgressProps {
    courses: {
        id: string;
        name: string;
        code: string;
        progress: number;
        instructor: string;
    }[];
}

export function CourseProgress({ courses }: CourseProgressProps) {
    return (
        <div className="bg-card rounded-xl p-6 border shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Course Progress</h3>

            <div className="space-y-4">
                {courses.map((course) => (
                    <div key={course.id} className="space-y-2">
                        <div className="flex justify-between">
                            <div>
                                <h4 className="font-medium">{course.name}</h4>
                                <p className="text-xs text-muted-foreground">{course.code} • {course.instructor}</p>
                            </div>
                            <span className="text-sm font-medium">{course.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}