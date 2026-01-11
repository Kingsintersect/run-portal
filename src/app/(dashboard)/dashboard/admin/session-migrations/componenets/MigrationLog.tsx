import { CheckCircle, XCircle } from "lucide-react";

export const MigrationLog = ({ logs }) => {
    if (logs.length === 0) return null;

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Migration Log</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-center space-x-3 text-sm">
                        <span className="text-gray-500 font-mono">{log.timestamp}</span>
                        {log.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {log.type === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                        {log.type === 'info' && <div className="w-4 h-4 rounded-full bg-blue-500"></div>}
                        <span className={`${log.type === 'success' ? 'text-green-700' :
                            log.type === 'error' ? 'text-red-700' : 'text-gray-700'
                            }`}>
                            {log.message}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};