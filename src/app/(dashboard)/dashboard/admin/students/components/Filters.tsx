'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, FilterX, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudentStore } from '../store/useStudentStore';
import { useAcademicData } from '../hooks/useAcademicData';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAllSemester, useAllAcademicSessions } from '@/hooks/useAccademics';

export function StudentFilters() {
    const {
        filters,
        setFilters,
        resetFilters,
    } = useStudentStore();

    const { departments } = useAcademicData();

    const { data: AllAcademicSessions, isLoading } = useAllAcademicSessions();
    const { data: allSemester, isLoading: isAllSemesterLoading } = useAllSemester();
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const debouncedSearch = useDebounce(searchValue, 500);

    // Update search filter with debounce
    useEffect(() => {
        setFilters({ search: debouncedSearch });
    }, [debouncedSearch, setFilters]);

    const currentAcademicSession = AllAcademicSessions?.find(
        session => session.id.toString() === filters.academic_session_id
    );
    const currentSemester = allSemester?.find(
        semester => semester.id.toString() === filters.semester_id
    );

    // Status options - REMOVE EMPTY STRING OPTION
    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'graduated', label: 'Graduated' },
        { value: 'suspended', label: 'Suspended' },
    ];

    return (
        <div className="flex flex-col gap-4 p-6 border rounded-lg bg-card shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Academic Filters</h3>
                </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Academic Session */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Academic Session
                    </label>
                    <Select
                        value={filters.academic_session_id}
                        onValueChange={(value) => setFilters({ academic_session_id: value })}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select session" />
                        </SelectTrigger>
                        <SelectContent>
                            {AllAcademicSessions?.map((session) => (
                                <SelectItem key={session.id} value={session.id.toString()}>
                                    <div className="flex items-center justify-between">
                                        <span>{session.name}</span>
                                        {session.status === "ACTIVE" && (
                                            <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {currentAcademicSession && (
                        <p className="text-xs text-muted-foreground">
                            {/* {currentAcademicSession.start_date} to {currentAcademicSession.end_date} */}
                        </p>
                    )}
                </div>

                {/* Semester */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Semester</label>
                    <Select
                        value={filters.semester_id}
                        onValueChange={(value) => setFilters({ semester_id: value })}
                        disabled={isAllSemesterLoading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                            {allSemester?.map((semester) => (
                                <SelectItem key={semester.id} value={semester.id.toString()}>
                                    <div className="flex items-center justify-between">
                                        <span>{semester.name}</span>
                                        {semester.status === 'ACTIVE' && (
                                            <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {currentSemester && (
                        <p className="text-xs text-muted-foreground">
                            Order: {currentSemester.status}
                        </p>
                    )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Select
                        value={filters.department_code || undefined} // Use undefined instead of empty string
                        onValueChange={(value) =>
                            setFilters({ department_code: value || undefined })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All departments" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Don't use empty string value - instead handle "All departments" differently */}
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((dept) => (
                                <SelectItem key={dept.code} value={dept.code}>
                                    {dept.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                        value={filters.status || 'all'} // Use 'all' as the select value
                        onValueChange={(value) =>
                            setFilters({ status: value === 'all' ? undefined : (value as 'active' | 'inactive' | 'graduated' | 'suspended') })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Use 'all' to represent no filter */}
                            <SelectItem value="all">All Statuses</SelectItem>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Search and Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, ID, or email..."
                        className="pl-10"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="Admission Year"
                        min="2000"
                        max="2030"
                        value={filters.admission_year || ''}
                        onChange={(e) =>
                            setFilters({
                                admission_year: e.target.value ? parseInt(e.target.value) : undefined
                            })
                        }
                        className="w-full"
                    />
                    <Button
                        variant="outline"
                        onClick={() => setFilters({ admission_year: new Date().getFullYear() })}
                    >
                        Current Year
                    </Button>
                </div>
            </div>
        </div>
    );
}