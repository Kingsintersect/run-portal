"use client";

import React, { useState } from 'react';
import { Users, GraduationCap } from 'lucide-react';
import { ApplicantsDataTable } from './components/ApplicantsDataTable';
import { SITE_NAME } from '@/config';
import { Badge } from '@/components/ui/badge';
import { AdmittedStudentDataTable } from './components/AdmittedStudentDataTable';

const StudentApplicationsPage = () => {
    const [activeTab, setActiveTab] = useState('applicants');
    const tabs = [
        { id: 'applicants', label: 'Admission Applicants', icon: Users },
        { id: 'students', label: `Student Listing`, icon: GraduationCap },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b mb-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-site-b-dark">Admission Officer</h1>
                            <p className="text-gray-500">{SITE_NAME} - Application Review</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                <Badge className="font-medium rounded-xl" variant={"destructive"}>{16}</Badge> Pending Review
                            </div>
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium">AO</span>
                            </div>
                        </div>
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
                {activeTab === 'applicants' && (
                    <ApplicantsDataTable />
                )}

                {activeTab === 'students' && (
                    <AdmittedStudentDataTable />
                )}
            </div>
        </div>
    );
};

export default StudentApplicationsPage;