'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useStudentStore } from '../store/useStudentStore';
import { useEffect, useState } from 'react';

const pageSizeOptions = [10, 25, 50, 100, 250];

export function PageSizeSelector() {
    const { pagination, setPageSize } = useStudentStore();
    const [currentPageSize, setCurrentPageSize] = useState('25');

    // Safely get the page size from pagination
    useEffect(() => {
        if (pagination && pagination.page_size) {
            setCurrentPageSize(pagination.page_size.toString());
        }
    }, [pagination]);

    const handleValueChange = (value: string) => {
        const newSize = parseInt(value);
        setCurrentPageSize(value);
        setPageSize(newSize);
    };

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
                value={currentPageSize}
                onValueChange={handleValueChange}
            >
                <SelectTrigger className="w-20">
                    <SelectValue placeholder="25" />
                </SelectTrigger>
                <SelectContent>
                    {pageSizeOptions.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                            {size}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries per page</span>
        </div>
    );
}