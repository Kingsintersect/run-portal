'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { useStudentStore } from '../store/useStudentStore';
import { useState } from 'react';
import { toast } from 'sonner';
import { ApiClient } from '../lib/api-client';
import { getSafePagination } from '../lib/utils';

export function ExportButton() {
    const { filters, students, pagination } = useStudentStore();
    const [isExporting, setIsExporting] = useState(false);

    // USE THE HELPER FUNCTION HERE
    const safePagination = getSafePagination(pagination);

    const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
        if (!filters.academic_session || !filters.program_id) {
            toast.error('Please select academic session and semester before exporting');
            return;
        }

        setIsExporting(true);
        const toastId = toast.loading(`Exporting students to ${format.toUpperCase()}...`);

        try {
            const blob = await ApiClient.exportStudents(filters, format);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Set filename based on filters and format
            const sessionName = filters.academic_session.replace(/\s+/g, '_');
            const semesterName = filters.program_id.replace(/\s+/g, '_');
            const date = new Date().toISOString().split('T')[0];
            const extension = format === 'csv' ? 'csv' : format === 'excel' ? 'xlsx' : 'pdf';

            a.download = `students_${sessionName}_${semesterName}_${date}.${extension}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // USE safePagination INSTEAD OF pagination
            toast.success(`Exported ${safePagination.total_items.toLocaleString()} students successfully`, {
                id: toastId,
            });
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export students. Please try again.', {
                id: toastId,
            });
        } finally {
            setIsExporting(false);
        }
    };

    const exportCurrentPage = () => {
        if (students.length === 0) {
            toast.error('No data to export');
            return;
        }

        const headers = ['Student ID', 'Name', 'Email', 'Program', 'Accademic Session', 'Status'];
        const csvContent = [
            headers.join(','),
            ...students.map(student => [
                student.id,
                student.reference,
                `"${(student?.first_name ?? '').replace(/"/g, '""')}" + " " + "${(student?.last_name ?? '').replace(/"/g, '""')}"`, // Escape quotes in names
                student.email,
                student.program,
                // student.program_name,
                student.accademic_session,
                student.status,
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // USE safePagination INSTEAD OF pagination
        link.download = `students_current_page_${safePagination.current_page}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        toast.success(`Exported ${students.length} students from current page`);
    };

    // USE safePagination INSTEAD OF pagination
    const hasData = safePagination.total_items > 0;

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={exportCurrentPage}
                disabled={students.length === 0 || isExporting}
                title="Export current page"
            >
                <Download className="h-4 w-4 mr-2" />
                Export Page
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        disabled={!filters.academic_session || !filters.program_id || isExporting || !hasData}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export All
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                        onClick={() => handleExport('csv')}
                        className="flex items-center gap-2 cursor-pointer"
                        disabled={!hasData}
                    >
                        <FileText className="h-4 w-4" />
                        Export as CSV
                        {/* USE safePagination INSTEAD OF pagination */}
                        <span className="ml-auto text-xs text-muted-foreground">
                            {hasData ? `${safePagination.total_items.toLocaleString()} records` : 'No data'}
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 cursor-pointer"
                        disabled={!hasData}
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        Export as Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 cursor-pointer"
                        disabled={!hasData}
                    >
                        <File className="h-4 w-4" />
                        Export as PDF
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}