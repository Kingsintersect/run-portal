import { CheckCircle, XCircle } from 'lucide-react';
import React from 'react'
import { getStatusColor } from '../../../data';

export const Assignments = () => {
    const assignmentsData = [
        { id: 1, title: "React Hooks Lab", dueDate: "2024-10-15", submitted: 18, total: 24, status: "active" },
        { id: 2, title: "Context API Project", dueDate: "2024-10-28", submitted: 12, total: 24, status: "active" },
        { id: 3, title: "Performance Optimization", dueDate: "2024-11-10", submitted: 8, total: 24, status: "upcoming" },
        { id: 4, title: "Final Project Proposal", dueDate: "2024-11-25", submitted: 0, total: 24, status: "upcoming" },
        { id: 5, title: "Component Testing", dueDate: "2024-09-30", submitted: 24, total: 24, status: "completed" }
    ];

    return (
        <div className="space-y-6">
            {assignmentsData.map(assignment => (
                <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                            <p className="text-gray-600 mt-1">Due: {assignment.dueDate}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Submissions</p>
                                <p className="text-lg font-semibold">
                                    {assignment.submitted}/{assignment.total}
                                </p>
                            </div>
                            <div className="flex items-center">
                                {assignment.submitted === assignment.total ? (
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                ) : (
                                    <XCircle className="w-6 h-6 text-red-500" />
                                )}
                            </div>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                            ></div>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Grade Assignment
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
