import { RefreshCw } from "lucide-react";
import { SessionCard } from "./SessionCard";

export const SemesterMigrationTab = ({
    currentSession,
    nextSemester,
    onMigrate,
    isLoading
}) => (
    <div className="space-y-6">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-900 mb-2">Semester Migration</h3>
            <p className="text-orange-800 text-sm">
                Migrate all student records from {currentSession?.semester} to {nextSemester?.semester}
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <SessionCard title="Current Semester" data={currentSession || {}} />
            <SessionCard title="Target Semester" data={nextSemester || {}} variant="semester" />
        </div>

        <div className="flex justify-center">
            <button
                onClick={() => onMigrate('Semester', {
                    from: currentSession?.semester,
                    to: nextSemester?.semester
                })}
                disabled={isLoading || !currentSession || !nextSemester}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
            >
                <RefreshCw className="w-5 h-5" />
                <span>Migrate to {nextSemester?.semester}</span>
            </button>
        </div>
    </div>
);