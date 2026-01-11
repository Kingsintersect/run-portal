import React from 'react'

export default function AssignmentsPage() {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
                {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                    <Plus size={16} />
                    <span>Create Assignment</span>
                </button> */}
            </div>
            <div className="space-y-4">
                {['Math Quiz 1', 'Physics Lab Report', 'Chemistry Worksheet'].map((assignment, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{assignment}</h3>
                            <span className="text-sm text-gray-600">Due: Jul 15, 2025</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">15 submissions pending review</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
