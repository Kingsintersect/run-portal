export const SessionCard = ({ title, data, variant = 'default' }) => {
    const bgColors = {
        default: 'bg-gray-50',
        target: 'bg-green-50',
        semester: 'bg-orange-50'
    };

    const textColors = {
        default: 'text-gray-900',
        target: 'text-green-700',
        semester: 'text-orange-700'
    };

    return (
        <div className={`${bgColors[variant]} rounded-lg p-4`}>
            <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600">Academic Year:</span>
                    <span className={`font-medium ${textColors[variant]}`}>{data.academicYear}</span>
                </div>
                {data.semester && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Semester:</span>
                        <span className={`font-medium ${textColors[variant]}`}>{data.semester}</span>
                    </div>
                )}
                {data.totalStudents && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Total Students:</span>
                        <span className="font-medium">{data.totalStudents}</span>
                    </div>
                )}
                {data.activeStudents && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Active Students:</span>
                        <span className="font-medium text-green-600">{data.activeStudents}</span>
                    </div>
                )}
            </div>
        </div>
    );
};