import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserData } from '@/hooks/useCreateUsers';

interface DataTableProps {
    data: UserData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
    // Only show up to 5 records in preview
    const previewData = data.slice(0, 5);
    const hasMoreRecords = data.length > 5;

    // Define columns to display
    const columns = [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'program', label: 'Program' }, // Added program column
        { key: 'course', label: 'Course' },   // Added course column
    ];

    return (
        <div className="">
            <h3 className="text-lg font-semibold mb-3">Data Preview</h3>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={column.key}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {previewData.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={`${rowIndex}-${column.key}`}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                                    >
                                        {typeof row[column.key as keyof UserData] === 'string' || typeof row[column.key as keyof UserData] === 'number'
                                            ? (row[column.key as keyof UserData] as React.ReactNode)
                                            : '-'}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {hasMoreRecords && (
                <p className="text-sm text-gray-500 mt-2">
                    Showing 5 of {data.length} records. All records will be processed on upload.
                </p>
            )}
        </div>
    );
};

export default DataTable;
