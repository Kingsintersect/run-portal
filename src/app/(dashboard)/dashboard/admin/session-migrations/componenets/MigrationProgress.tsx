import { CheckCircle } from "lucide-react";

export const MigrationProgress = ({ progress, status, onReset }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Migration Progress</h3>
            {status === 'success' && (
                <button
                    onClick={onReset}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    Reset
                </button>
            )}
        </div>

        <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>

        {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">Migration completed successfully!</span>
            </div>
        )}
    </div>
);
