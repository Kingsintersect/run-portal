"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
type MigrationLogEntry = {
    id: number;
    message: string;
    type: 'info' | 'success' | 'error';
    timestamp: string;
};
// type ConfirmDialogState = {
//     open: boolean;
//     type: string;
//     details: {
//         from?: string;
//         to?: string;
//     };
// };

// API Services
const migrationAPI = {
    getCurrentSession: async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            academicYear: '2025/2026',
            semester: 'First Semester',
            totalStudents: 1247,
            activeStudents: 1198
        };
    },

    getNextSession: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
            academicYear: '2026/2027',
            semester: 'First Semester'
        };
    },

    getNextSemester: async (currentSession) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
            academicYear: currentSession.academicYear,
            semester: currentSession.semester === 'First Semester' ? 'Second Semester' : 'First Semester'
        };
    },

    migrateSession: async ({ toSession, onProgress }) => {
        const steps = [
            'Validating student records...',
            'Backing up current session data...',
            'Creating new session records...',
            'Migrating student enrollments...',
            'Updating course registrations...',
            'Validating migrated data...',
            'Migration completed successfully!'
        ];

        const logs: MigrationLogEntry[] = [];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const progress = ((i + 1) / steps.length) * 100;
            const logEntry: MigrationLogEntry = {
                id: Date.now() + i,
                message: steps[i],
                type: i === steps.length - 1 ? 'success' : 'info',
                timestamp: new Date().toLocaleTimeString()
            };

            logs.push(logEntry);
            onProgress?.(progress, logEntry);
        }

        return {
            success: true,
            logs,
            migratedStudents: 1198,
            newSession: toSession
        };
    }
};

export const useCurrentSession = () => {
    return useQuery({
        queryKey: ['currentSession'],
        queryFn: migrationAPI.getCurrentSession,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useNextSession = () => {
    return useQuery({
        queryKey: ['nextSession'],
        queryFn: migrationAPI.getNextSession,
        staleTime: 5 * 60 * 1000,
    });
};

export const useNextSemester = (currentSession) => {
    return useQuery({
        queryKey: ['nextSemester', currentSession?.academicYear, currentSession?.semester],
        queryFn: () => migrationAPI.getNextSemester(currentSession),
        enabled: !!currentSession,
        staleTime: 5 * 60 * 1000,
    });
};

export const useMigration = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: migrationAPI.migrateSession,
        onSuccess: () => {
            // Invalidate and refetch session data after successful migration
            queryClient.invalidateQueries({ queryKey: ['currentSession'] });
            queryClient.invalidateQueries({ queryKey: ['nextSession'] });
            queryClient.invalidateQueries({ queryKey: ['nextSemester'] });
        },
    });
};

// Custom Hook for Migration State Management
export const useMigrationState = () => {
    const [migrationProgress, setMigrationProgress] = useState(0);
    const [migrationLogs, setMigrationLogs] = useState<{ id: number; message: string; type: string; timestamp: string }[]>([]);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: '',
        details: {}
    });

    const addLog = (logEntry) => {
        setMigrationLogs(prev => [...prev, logEntry]);
    };

    const updateProgress = (progress) => {
        setMigrationProgress(progress);
    };

    const resetMigration = () => {
        setMigrationProgress(0);
        setMigrationLogs([]);
    };

    const openConfirmDialog = (type, details) => {
        setConfirmDialog({ open: true, type, details });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ open: false, type: '', details: {} });
    };

    return {
        migrationProgress,
        migrationLogs,
        confirmDialog,
        addLog,
        updateProgress,
        resetMigration,
        openConfirmDialog,
        closeConfirmDialog
    };
};