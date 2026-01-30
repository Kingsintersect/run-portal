'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, FilterX, Calendar, BookOpen, SplitSquareHorizontalIcon, ScanSearch, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAcademicSessions, useChildPrograms, useFilters, useIsLoading, useParentPrograms, useStudentActions } from '../store/useStudentStore';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { ProgramMenu } from './ProgramMenu';

export function StudentFilters({ tokenLoader }: { tokenLoader: boolean }) {
    const academicSessions = useAcademicSessions();
    const parentPrograms = useParentPrograms();
    const childPrograms = useChildPrograms();
    const isLoading = useIsLoading();
    const filters = useFilters();
    const { setFilters, resetFilters } = useStudentActions();

    // Debug logging
    // useEffect(() => {
    //     console.log('Parent programs updated:', parentPrograms);
    //     console.log('Child programs updated:', childPrograms);
    //     console.log('Filters updated:', filters);
    // }, [parentPrograms, childPrograms, filters]);

    const [searchValue, setSearchValue] = useState(filters.search || '');
    const debouncedSearch = useDebounce(searchValue, 500);

    // Update search filter with debounce
    useEffect(() => {
        setFilters({ search: debouncedSearch });
    }, [debouncedSearch, setFilters]);

    const applicationStatusOptions = [
        { value: '1', label: 'Applied' },
        { value: '0', label: 'Not Applied' },
    ];

    const admissionStatusOptions = [
        { value: 'ADMITTED', label: 'Admitted' },
        { value: 'NOT_ADMITTED', label: 'Not Admitted' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'DENIED', label: 'Denied' },
    ];

    console.log('Filters:', filters);

    return (
        <div className="flex flex-col gap-7 p-6 border rounded-lg bg-card shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Academic Filters</h3>
                </div>
                <div className="flex gap-7 items-center">
                    {tokenLoader && <Loader2 className='h-7 w-7 animate-spin text-blue-500' />}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="flex items-center gap-2"
                    >
                        <FilterX className="h-4 w-4" />
                        Clear All
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Academic Session
                    </label>
                    <Select
                        value={filters.academic_session}
                        onValueChange={(value) => {
                            setFilters({ academic_session: value })
                        }}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select session" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Academic Session</SelectLabel>
                                {academicSessions?.map((academicSession) => (
                                    <SelectItem key={academicSession.id} value={academicSession.name.toString()}>
                                        <div className="flex items-center justify-between">
                                            <span>{academicSession.name}</span>
                                            {academicSession.status === "ACTIVE" && (
                                                <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Application Status */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <SplitSquareHorizontalIcon className="h-4 w-4" />
                        Application Status
                    </label>
                    <Select
                        value={filters.application_status || 'all'}  // Use 'all' as default when undefined
                        onValueChange={(value) => {
                            // Set to undefined when 'all' is selected, otherwise use the value
                            const application_status = value === 'all' ? undefined : value;
                            setFilters({ application_status });  // Fixed: should be application_status, not admission_status
                        }}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Application Status</SelectLabel>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {applicationStatusOptions?.map((status) => (
                                    <SelectItem key={status.value} value={status.value.toString()}>
                                        <div className="flex items-center justify-between">
                                            <span>{status.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Programe */}
                <div className="space-y-2 col-span-1 md:col-span-2">
                    <ProgramMenu
                        filters={filters}
                        setFilters={setFilters}
                        isLoading={isLoading}
                        parentPrograms={parentPrograms}
                        childPrograms={childPrograms}
                    />
                </div>

            </div>

            {/* Search and Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <ScanSearch className="h-4 w-4" />
                        Search Students
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, ID, or email..."
                            className="pl-10"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <SplitSquareHorizontalIcon className="h-4 w-4" />
                        Admission Status
                    </label>
                    <Select
                        value={filters.admission_status || 'all'} // Use 'all' as default
                        onValueChange={(value) => {
                            // Convert 'all' to undefined for API
                            const admissionStatus = value === 'all' ? undefined : value;
                            setFilters({ admission_status: admissionStatus });
                        }}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Admission Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Admission Status</SelectLabel>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {admissionStatusOptions?.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}