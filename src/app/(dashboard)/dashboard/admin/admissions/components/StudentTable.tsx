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
    VisibilityState,
} from '@tanstack/react-table';
import { useStudentStore } from '../store/useStudentStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, User, MoreVertical } from 'lucide-react';
import { LoadingSkeleton } from './LoadingSkeleton';
import { Student } from '../types/student';
import { getSafePagination } from '../lib/utils';
import { ActionMenu } from './ActionMenu';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define columns with responsive priorities
const columns: ColumnDef<Student>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
            <div className="text-center min-w-[60px]">
                <div className="font-medium">{Number(row.id) + 1}</div>
            </div>
        ),
        enableHiding: false, // Always show ID
    },
    {
        accessorKey: 'first_name',
        header: 'First Name',
        cell: ({ row }) => (
            <div className="flex items-center gap-2 min-w-[120px]">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                </div>
                <div className="truncate">
                    <div className="font-medium truncate">{row.getValue('first_name')}</div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'last_name',
        header: 'Last Name',
        cell: ({ row }) => (
            <div className="min-w-[120px]">
                <div className="font-medium truncate">{row.getValue('last_name')}</div>
            </div>
        ),
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
            <div className="min-w-[180px] max-w-[220px]">
                <div className="font-medium truncate">{row.getValue('email')}</div>
            </div>
        ),
    },
    {
        accessorKey: 'program',
        header: 'Program',
        cell: ({ row }) => (
            <div className="min-w-[150px] max-w-[200px]">
                <div className="font-medium truncate">{row.getValue('program')}</div>
            </div>
        ),
    },
    {
        accessorKey: 'is_applied',
        header: 'Status',
        cell: ({ row }) => {
            const applicationStatus = row.getValue('is_applied') as string | number;
            const applicationStatusConfig = {
                1: { color: 'bg-green-100 text-green-800', label: 'Applied' },
                0: { color: 'bg-red-100 text-red-800', label: 'Not Applied' },
            };

            const config = applicationStatusConfig[Number(applicationStatus) as keyof typeof applicationStatusConfig] ||
                { color: 'bg-red-100 text-red-800', label: applicationStatus };

            return (
                <div className="min-w-[100px]">
                    <div className="flex justify-center">
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium truncate ${config.color}`}>
                            {config.label}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: () => (
            <div className="text-center">Actions</div>
        ),
        cell: ({ row }) => {
            const student = row.original;
            return (
                <div className="flex justify-center min-w-[80px]">
                    <ActionMenu studentId={String(student.id)} />
                </div>
            );
        },
        enableHiding: false, // Always show actions
    },
];

interface StudentTableProps {
    onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export function StudentTable({ onSortChange }: StudentTableProps) {
    const { students, isLoading, error, pagination } = useStudentStore();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    // USE THE HELPER FUNCTION HERE
    const safePagination = getSafePagination(pagination);

    const table = useReactTable({
        data: students,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnFilters,
            sorting,
            columnVisibility,
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
            <div className="p-4 border-b bg-muted/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Student Records</h3>
                    <p className="text-sm text-muted-foreground">
                        Showing {students.length} of {safePagination.total_items.toLocaleString()} students
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm bg-background px-3 py-1 rounded-full">
                        <span className="font-medium">Page {safePagination.current_page}</span>
                        <span className="text-muted-foreground"> of {safePagination.total_pages}</span>
                    </div>

                    {/* Column Visibility Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                                <MoreVertical className="h-4 w-4 mr-2" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) => column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table className="w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/30">
                                {headerGroup.headers.map((header) => {
                                    const isVisible = header.column.getIsVisible();
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="font-semibold px-3 py-3"
                                            style={{
                                                display: isVisible ? 'table-cell' : 'none'
                                            }}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleSort(header.column.id)}
                                                    className="hover:bg-transparent p-0 h-auto font-semibold whitespace-nowrap"
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {sorting.find((sort) => sort.id === header.column.id)?.desc ? (
                                                        <ChevronDown className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
                                                    ) : (
                                                        <ChevronUp className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
                                                    )}
                                                </Button>
                                            )}
                                        </TableHead>
                                    );
                                })}
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
                                    {row.getVisibleCells().map((cell) => {
                                        const isVisible = cell.column.getIsVisible();
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className="px-3 py-3 max-w-[200px] truncate"
                                                style={{
                                                    display: isVisible ? 'table-cell' : 'none'
                                                }}
                                            >
                                                <div className="truncate">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            </TableCell>
                                        );
                                    })}
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














// 'use client';

// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from '@/components/ui/table';
// import {
//     ColumnDef,
//     flexRender,
//     getCoreRowModel,
//     useReactTable,
//     ColumnFiltersState,
// } from '@tanstack/react-table';
// import { useStudentStore } from '../store/useStudentStore';
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { ChevronUp, ChevronDown, User } from 'lucide-react';
// import { LoadingSkeleton } from './LoadingSkeleton';
// import { Student } from '../types/student';
// import { getSafePagination } from '../lib/utils';
// import { ActionMenu } from './ActionMenu';

// const columns: ColumnDef<Student>[] = [
//     {
//         accessorKey: 'id',
//         header: 'Student ID',
//         cell: ({ row }) => (
//             <div className={"text-center"}>
//                 <div className="font-medium">{Number(row.id) + 1}</div>
//                 {/* <div className="text-xs text-muted-foreground">
//                     {row.getValue('id')}
//                 </div> */}
//             </div>
//         ),
//     },
//     {
//         accessorKey: 'first_name',
//         header: 'First Name',
//         cell: ({ row }) => (
//             <div className="flex items-center gap-3">
//                 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//                     <User className="h-4 w-4 text-primary" />
//                 </div>
//                 <div>
//                     <div className="font-medium">{row.getValue('first_name')}</div>
//                     {/* <div className="text-xs text-muted-foreground">
//                         {row.original.email}
//                     </div> */}
//                 </div>
//             </div>
//         ),
//     },
//     {
//         accessorKey: 'last_name',
//         header: 'Last Name',
//         cell: ({ row }) => (
//             <div className="flex items-center gap-3">
//                 <div>
//                     <div className="font-medium">{row.getValue('last_name')}</div>
//                 </div>
//             </div>
//         ),
//     },
//     {
//         accessorKey: 'email',
//         header: 'Email',
//         cell: ({ row }) => (
//             <div>
//                 <div className="font-medium">{row.getValue('email')}</div>
//             </div>
//         ),
//     },
//     {
//         accessorKey: 'program',
//         header: 'Program',
//         cell: ({ row }) => (
//             <div>
//                 <div className="font-medium">{row.getValue('program')}</div>
//                 <div className="text-xs text-muted-foreground">
//                     {row.original.program}
//                 </div>
//             </div>
//         ),
//     },
//     {
//         accessorKey: 'is_applied',
//         header: 'Application Status',
//         cell: ({ row }) => {
//             const applicationStatus = row.getValue('is_applied') as string | number;
//             const applicationStatusConfig = {
//                 1: { color: 'bg-green-100 text-green-800', label: 'Applied' },
//                 0: { color: 'bg-red-100 text-red-800', label: 'Not Applied' },
//             };

//             const config = applicationStatusConfig[Number(applicationStatus) as keyof typeof applicationStatusConfig] ||
//                 { color: 'bg-red-100 text-red-800', label: applicationStatus };

//             return (
//                 <div className="text-center">
//                     <div className="flex justify-center">
//                         <div className={`px-3 py-1 rounded-lg text-xs font-medium ${config.color}`}>{config.label}</div>
//                     </div>
//                     <div className="text-xs text-muted-foreground">
//                         {`${row.original.start_year}`}
//                     </div>
//                 </div>
//             );
//         },
//     },
//     {
//         id: 'actions',
//         header: 'Actions',
//         cell: ({ row }) => {
//             const student = row.original;

//             return (
//                 <ActionMenu studentId={String(student.id)} />
//             );
//         },
//     },
// ];

// interface StudentTableProps {
//     onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
// }

// export function StudentTable({ onSortChange }: StudentTableProps) {
//     const { students, isLoading, error, pagination } = useStudentStore();
//     const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//     const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

//     // USE THE HELPER FUNCTION HERE
//     const safePagination = getSafePagination(pagination);

//     const table = useReactTable({
//         data: students,
//         columns,
//         getCoreRowModel: getCoreRowModel(),
//         onColumnFiltersChange: setColumnFilters,
//         onSortingChange: setSorting,
//         state: {
//             columnFilters,
//             sorting,
//         },
//         manualSorting: true,
//         manualFiltering: true,
//     });

//     const handleSort = (columnId: string) => {
//         const currentSort = sorting.find((sort) => sort.id === columnId);
//         let newSortOrder: 'asc' | 'desc' = 'asc';

//         if (currentSort) {
//             newSortOrder = currentSort.desc ? 'asc' : 'desc';
//         }

//         onSortChange?.(columnId, newSortOrder);
//     };

//     if (error) {
//         return (
//             <div className="text-center py-12 border rounded-lg">
//                 <div className="text-red-600 mb-2">
//                     <p className="font-semibold">Error Loading Students</p>
//                     <p className="text-sm">{error}</p>
//                 </div>
//                 <Button
//                     variant="outline"
//                     onClick={() => useStudentStore.getState().fetchStudents()}
//                 >
//                     Try Again
//                 </Button>
//             </div>
//         );
//     }

//     if (isLoading) {
//         return <LoadingSkeleton />;
//     }

//     return (
//         <div className="border rounded-lg overflow-hidden">
//             <div className="p-4 border-b bg-muted/50">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h3 className="text-lg font-semibold">Student Records</h3>
//                         {/* USE safePagination INSTEAD OF pagination */}
//                         <p className="text-sm text-muted-foreground">
//                             Showing {students.length} of {safePagination.total_items.toLocaleString()} students
//                         </p>
//                     </div>
//                     <div className="text-sm bg-background px-3 py-1 rounded-full">
//                         {/* USE safePagination INSTEAD OF pagination */}
//                         <span className="font-medium">Page {safePagination.current_page}</span>
//                         <span className="text-muted-foreground"> of {safePagination.total_pages}</span>
//                     </div>
//                 </div>
//             </div>

//             <div className="overflow-x-auto">
//                 <Table>
//                     <TableHeader>
//                         {table.getHeaderGroups().map((headerGroup) => (
//                             <TableRow key={headerGroup.id} className="bg-muted/30">
//                                 {headerGroup.headers.map((header) => (
//                                     <TableHead key={header.id} className="font-semibold">
//                                         {header.isPlaceholder ? null : (
//                                             <Button
//                                                 variant="ghost"
//                                                 onClick={() => handleSort(header.column.id)}
//                                                 className="hover:bg-transparent p-0 h-auto font-semibold"
//                                             >
//                                                 {flexRender(
//                                                     header.column.columnDef.header,
//                                                     header.getContext()
//                                                 )}
//                                                 {sorting.find((sort) => sort.id === header.column.id)?.desc ? (
//                                                     <ChevronDown className="ml-2 h-4 w-4" />
//                                                 ) : (
//                                                     <ChevronUp className="ml-2 h-4 w-4" />
//                                                 )}
//                                             </Button>
//                                         )}
//                                     </TableHead>
//                                 ))}
//                             </TableRow>
//                         ))}
//                     </TableHeader>
//                     <TableBody>
//                         {table.getRowModel().rows?.length ? (
//                             table.getRowModel().rows.map((row) => (
//                                 <TableRow
//                                     key={row.id}
//                                     className="hover:bg-muted/50 transition-colors"
//                                 >
//                                     {row.getVisibleCells().map((cell) => (
//                                         <TableCell key={cell.id}>
//                                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={columns.length} className="text-center py-12">
//                                     <div className="flex flex-col items-center gap-2">
//                                         <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
//                                             <User className="h-6 w-6 text-muted-foreground" />
//                                         </div>
//                                         <p className="font-medium">No students found</p>
//                                         <p className="text-sm text-muted-foreground">
//                                             Try adjusting your filters or search criteria
//                                         </p>
//                                     </div>
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>
//         </div>
//     );
// }