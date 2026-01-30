'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnFiltersState,
} from '@tanstack/react-table';
import { useStudentStore } from '../store/useStudentStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, User } from 'lucide-react';
import { LoadingSkeleton } from './LoadingSkeleton';
import { Student } from '../types/student';
import { getSafePagination } from '../lib/utils';
import { ActionMenu } from './ActionMenu';

const columns: ColumnDef<Student>[] = [
    {
        accessorKey: 'id',
        header: 'Student ID',
        cell: ({ row }) => (
            <div className={"text-center"}>
                <div className="font-medium">{Number(row.id) + 1}</div>
                {/* <div className="text-xs text-muted-foreground">
                    {row.getValue('id')}
                </div> */}
            </div>
        ),
    },
    {
        accessorKey: 'first_name',
        header: 'First Name',
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <div className="font-medium">{row.getValue('first_name')}</div>
                    {/* <div className="text-xs text-muted-foreground">
                        {row.original.email}
                    </div> */}
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'last_name',
        header: 'Last Name',
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div>
                    <div className="font-medium">{row.getValue('last_name')}</div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.getValue('email')}</div>
            </div>
        ),
    },
    {
        accessorKey: 'program',
        header: 'Program',
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.getValue('program')}</div>
                <div className="text-xs text-muted-foreground">
                    {row.original.program}
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'is_applied',
        header: 'Application Status',
        cell: ({ row }) => {
            const applicationStatus = row.getValue('is_applied') as string | number;
            const applicationStatusConfig = {
                1: { color: 'bg-green-100 text-green-800', label: 'Applied' },
                0: { color: 'bg-red-100 text-red-800', label: 'Not Applied' },
            };

            const config = applicationStatusConfig[Number(applicationStatus) as keyof typeof applicationStatusConfig] ||
                { color: 'bg-red-100 text-red-800', label: applicationStatus };

            return (
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className={`px-3 py-1 rounded-lg text-xs font-medium ${config.color}`}>{config.label}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {`${row.original.start_year}`}
                    </div>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const student = row.original;

            return (
                <ActionMenu studentId={String(student.id)} />
            );
        },
    },
];

interface StudentTableProps {
    onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export function StudentTable({ onSortChange }: StudentTableProps) {
    const { students, isLoading, error, pagination } = useStudentStore();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

    // USE THE HELPER FUNCTION HERE
    const safePagination = getSafePagination(pagination);

    const table = useReactTable({
        data: students,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        state: {
            columnFilters,
            sorting,
        },
        manualSorting: true,
        manualFiltering: true,
    });

    const handleSort = (columnId: string) => {
        const currentSort = sorting.find((sort) => sort.id === columnId);
        let newSortOrder: 'asc' | 'desc' = 'asc';

        if (currentSort) {
            newSortOrder = currentSort.desc ? 'asc' : 'desc';
        }

        onSortChange?.(columnId, newSortOrder);
    };

    if (error) {
        return (
            <div className="text-center py-12 border rounded-lg">
                <div className="text-red-600 mb-2">
                    <p className="font-semibold">Error Loading Students</p>
                    <p className="text-sm">{error}</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => useStudentStore.getState().fetchStudents()}
                >
                    Try Again
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Student Records</h3>
                        {/* USE safePagination INSTEAD OF pagination */}
                        <p className="text-sm text-muted-foreground">
                            Showing {students.length} of {safePagination.total_items.toLocaleString()} students
                        </p>
                    </div>
                    <div className="text-sm bg-background px-3 py-1 rounded-full">
                        {/* USE safePagination INSTEAD OF pagination */}
                        <span className="font-medium">Page {safePagination.current_page}</span>
                        <span className="text-muted-foreground"> of {safePagination.total_pages}</span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/30">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-semibold">
                                        {header.isPlaceholder ? null : (
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort(header.column.id)}
                                                className="hover:bg-transparent p-0 h-auto font-semibold"
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {sorting.find((sort) => sort.id === header.column.id)?.desc ? (
                                                    <ChevronDown className="ml-2 h-4 w-4" />
                                                ) : (
                                                    <ChevronUp className="ml-2 h-4 w-4" />
                                                )}
                                            </Button>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-muted/50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                            <User className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="font-medium">No students found</p>
                                        <p className="text-sm text-muted-foreground">
                                            Try adjusting your filters or search criteria
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}