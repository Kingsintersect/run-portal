import { Users } from "lucide-react";
import { SessionCard } from "./SessionCard";

export const SessionMigrationTab = ({
    currentSession,
    nextSession,
    onMigrate,
    isLoading
}) => (
    <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Academic Year Migration</h3>
            <p className="text-blue-800 text-sm">
                Migrate all student records from {currentSession?.academicYear} to {nextSession?.academicYear}
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <SessionCard title="Current Session" data={currentSession || {}} />
            <SessionCard title="Target Session" data={nextSession || {}} variant="target" />
        </div>

        <div className="flex justify-center">
            <button
                onClick={() => onMigrate('Academic Year', {
                    from: currentSession?.academicYear,
                    to: nextSession?.academicYear
                })}
                disabled={isLoading || !currentSession || !nextSession}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
            >
                <Users className="w-5 h-5" />
                <span>Migrate to {nextSession?.academicYear}</span>
            </button>
        </div>
    </div>
);