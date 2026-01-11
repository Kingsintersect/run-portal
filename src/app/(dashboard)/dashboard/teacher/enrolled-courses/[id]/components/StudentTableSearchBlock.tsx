"use client";

import { Filter, Search } from 'lucide-react'
// import React, { useState } from 'react'

export default function StudentTableSearchBlock({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) {
    // const [searchTerm, setSearchTerm] = useState('');
    // const [filterStatus, setFilterStatus] = useState('all');
    // // const filteredStudents = studentsData.filter(student => {
    // //     const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // //         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    // //     const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    // //     return matchesSearch && matchesFilter;
    // });
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Students</option>
                        <option value="A">Excellent</option>
                        <option value="B">Very Good</option>
                        <option value="C">Good</option>
                        <option value="D">Fair</option>
                        <option value="E">Poor</option>
                        <option value="F">Failed</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
