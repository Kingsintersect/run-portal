'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useStudentStore } from '../store/useStudentStore';

const pageSizeOptions = [10, 25, 50, 100, 250];

export function PageSizeSelector() {
    const { pagination, setPageSize } = useStudentStore();

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
                value={pagination.page_size.toString()}
                onValueChange={(value) => setPageSize(parseInt(value))}
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