"use client";

import React, { useState } from 'react';
import { FileText, Users, BookOpen, GraduationCap } from 'lucide-react';
import { Resources } from './components/Resources';
import { Assignments } from './components/Assignments';
import { CourseOverview } from './components/CourseOverview';
import { courseData } from '../../data';
import StudentsInCourse from './components/StudentsInCourse';

const CourseSpecificView = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const tabs = [
        { id: 'overview', label: 'Overview', icon: BookOpen },
        { id: 'grades', label: `Student's Grades`, icon: Users },
        { id: 'assignments', label: 'Assignments', icon: GraduationCap },
        { id: 'resources', label: 'Resources', icon: FileText }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-3xl font-bold text-gray-900">{courseData.title}</h1>
                        <p className="text-lg text-gray-600 mt-1">{courseData.code} • {courseData.semester}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'overview' && (
                    <CourseOverview />
                )}

                {activeTab === 'grades' && (
                    <StudentsInCourse />
                )}

                {activeTab === 'assignments' && (
                    <Assignments />
                )}

                {activeTab === 'resources' && (
                    <Resources />
                )}
            </div>
        </div>
    );
};

export default CourseSpecificView;