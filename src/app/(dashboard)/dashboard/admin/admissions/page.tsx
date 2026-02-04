'use client';

import { StudentFilters } from './components/Filters';
import { StudentTable } from './components/StudentTable';
import { PaginationControls } from './components/Pagination';
import { PageSizeSelector } from './components/PageSizeSelector';
import { ExportButton } from './components/ExportButton';
import { useStudentStore } from './store/useStudentStore';
import { useEffect } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccessToken } from './hooks/useAccessToken';

export default function StudentsPage() {
    const { token, isLoading: tokenLoading } = useAccessToken();
    const { fetchStudents, error, clearError, fetchAcademicData } = useStudentStore();

    // Initial fetch on component mount
    useEffect(() => {
        if (!tokenLoading && token) {
            fetchAcademicData(token);
        }
    }, [fetchAcademicData, token, tokenLoading]);

    const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
        // Update sorting in store and refetch
        useStudentStore.getState().setSorting(sortBy, sortOrder);
    };

    return (
        <div className="container mx-auto p-4 md:p-6 overflow-x-hidden">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Manage Admission</h1>
                            <p className="text-muted-foreground">
                                Manage and view admission applicants. Grant or deny admissions. filtering by application status.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ExportButton />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => fetchStudents()}
                            title="Refresh data"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Performance Note */}
                <Alert className="mb-6 bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                        Showing paginated results for new applicants. Use filters to narrow down
                        results for better performance with on large student records.
                    </AlertDescription>
                </Alert>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                <StudentFilters tokenLoader={tokenLoading} />

                {/* Table Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <PageSizeSelector />
                    {error && (
                        <Alert variant="destructive" className="sm:w-auto">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {error}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 h-auto p-0"
                                    onClick={clearError}
                                >
                                    Dismiss
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Student Table */}
                <StudentTable onSortChange={handleSortChange} />

                {/* Pagination */}
                <PaginationControls />
            </div>
        </div>
    );
}

// Helper components
