"use client";

import React, { useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { useCurrentSession, useMigration, useMigrationState, useNextSemester, useNextSession } from '@/hooks/useSessionMigration';
import { SessionMigrationTab } from './componenets/SessionMigrationTab';
import { SemesterMigrationTab } from './componenets/SemesterMigrationTab';
import { MigrationProgress } from './componenets/MigrationProgress';
import { MigrationLog } from './componenets/MigrationLog';
import { ConfirmationDialog } from './componenets/ConfirmationDialog';

const AdminMigrationInterface = () => {
    const [activeTab, setActiveTab] = useState('session');

    // Data fetching with React Query
    const { data: currentSession, isLoading: isCurrentLoading } = useCurrentSession();
    const { data: nextSession, isLoading: isNextLoading } = useNextSession();
    const { data: nextSemester, isLoading: isSemesterLoading } = useNextSemester(currentSession);

    // Migration mutation
    const migrationMutation = useMigration();

    // Local state management
    const {
        migrationProgress,
        migrationLogs,
        confirmDialog,
        addLog,
        updateProgress,
        resetMigration,
        openConfirmDialog,
        closeConfirmDialog
    } = useMigrationState();

    const handleMigrationConfirm = async () => {
        const { type } = confirmDialog;
        closeConfirmDialog();

        const migrationData = {
            type,
            fromSession: currentSession,
            toSession: type === 'Academic Year' ? nextSession : nextSemester,
            onProgress: (progress, logEntry) => {
                updateProgress(progress);
                addLog(logEntry);
            }
        };

        try {
            await migrationMutation.mutateAsync(migrationData);
        } catch (error) {
            addLog({
                id: Date.now(),
                message: `Migration failed: ${error instanceof Error ? error.message : String(error)}`,
                type: 'error',
                timestamp: new Date().toLocaleTimeString()
            });
        }
    };

    const isLoading = isCurrentLoading || isNextLoading || isSemesterLoading;
    const isMigrating = migrationMutation.isPending;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Academic Session Migration</h1>
                            <p className="text-gray-600 mt-1">Manage student academic session and semester transitions</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Current Session</p>
                                <p className="font-semibold">{currentSession?.academicYear || 'Loading...'}</p>
                                <p className="text-sm text-blue-600">{currentSession?.semester || ''}</p>
                            </div>
                            <div className="h-12 w-px bg-gray-300"></div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Active Students</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {currentSession?.activeStudents || '...'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm border mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('session')}
                                className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'session'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Calendar className="inline w-4 h-4 mr-2" />
                                Academic Year Migration
                            </button>
                            <button
                                onClick={() => setActiveTab('semester')}
                                className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'semester'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <RefreshCw className="inline w-4 h-4 mr-2" />
                                Semester Migration
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'session' && (
                            <SessionMigrationTab
                                currentSession={currentSession}
                                nextSession={nextSession}
                                onMigrate={openConfirmDialog}
                                isLoading={isLoading || isMigrating}
                            />
                        )}

                        {activeTab === 'semester' && (
                            <SemesterMigrationTab
                                currentSession={currentSession}
                                nextSemester={nextSemester}
                                onMigrate={openConfirmDialog}
                                isLoading={isLoading || isMigrating}
                            />
                        )}
                    </div>
                </div>

                {/* Migration Progress */}
                {(isMigrating || migrationMutation.isSuccess) && (
                    <MigrationProgress
                        progress={migrationProgress}
                        status={migrationMutation.isSuccess ? 'success' : 'running'}
                        onReset={resetMigration}
                    />
                )}

                {/* Migration Log */}
                <MigrationLog logs={migrationLogs} />

                {/* Confirmation Dialog */}
                <ConfirmationDialog
                    isOpen={confirmDialog.open}
                    onClose={closeConfirmDialog}
                    onConfirm={handleMigrationConfirm}
                    migrationDetails={confirmDialog}
                    activeStudents={currentSession?.activeStudents}
                />
            </div>
        </div>
    );
};

export default AdminMigrationInterface;