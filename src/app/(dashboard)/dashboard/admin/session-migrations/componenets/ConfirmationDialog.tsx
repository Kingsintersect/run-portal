import { AlertTriangle } from "lucide-react";

export const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    migrationDetails,
    activeStudents
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-amber-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Confirm Migration</h3>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                        Are you sure you want to migrate all student records?
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Migration Type:</span>
                            <span className="font-medium">{migrationDetails.type}</span>
                        </div>
                        {migrationDetails.details.from && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">From:</span>
                                <span className="font-medium">{migrationDetails.details.from}</span>
                            </div>
                        )}
                        {migrationDetails.details.to && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">To:</span>
                                <span className="font-medium text-green-600">{migrationDetails.details.to}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Students Affected:</span>
                            <span className="font-medium">{activeStudents}</span>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-amber-800 text-sm">
                            <strong>Warning:</strong> This action cannot be undone. Please ensure you have a recent backup.
                        </p>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium"
                    >
                        Confirm Migration
                    </button>
                </div>
            </div>
        </div>
    );
};