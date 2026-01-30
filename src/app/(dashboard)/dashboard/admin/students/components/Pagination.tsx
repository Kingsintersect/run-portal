'use client';

import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
} from 'lucide-react';
import { useStudentStore } from '../store/useStudentStore';
import { getSafePagination } from '../lib/utils';

export function PaginationControls() {
    const { pagination, setCurrentPage, isLoading } = useStudentStore();

    // USE THE HELPER FUNCTION HERE
    const safePagination = getSafePagination(pagination);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= safePagination.total_pages && !isLoading) {
            setCurrentPage(page);
        }
    };

    if (safePagination.total_pages <= 1) return null;

    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const current = safePagination.current_page;
        const total = safePagination.total_pages;
        const delta = 2;

        // Always show first page
        pages.push(1);

        // Calculate range around current page
        const rangeStart = Math.max(2, current - delta);
        const rangeEnd = Math.min(total - 1, current + delta);

        // Add ellipsis if needed before range
        if (rangeStart > 2) {
            pages.push('...');
        }

        // Add page numbers in range
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }

        // Add ellipsis if needed after range
        if (rangeEnd < total - 1) {
            pages.push('...');
        }

        // Always show last page if there is more than 1 page
        if (total > 1) {
            pages.push(total);
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
                {/* USE safePagination INSTEAD OF pagination */}
                Showing {((safePagination.current_page - 1) * safePagination.page_size + 1).toLocaleString()}
                {' to '}
                {Math.min(safePagination.current_page * safePagination.page_size, safePagination.total_items).toLocaleString()}
                {' of '}
                {safePagination.total_items.toLocaleString()} students
            </div>

            <div className="flex items-center space-x-1">
                {/* First Page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(1)}
                    disabled={safePagination.current_page === 1 || isLoading}
                    className="h-8 w-8"
                >
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">First page</span>
                </Button>

                {/* Previous Page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(safePagination.current_page - 1)}
                    disabled={safePagination.current_page === 1 || isLoading}
                    className="h-8 w-8"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                    {pageNumbers.map((page, index) => {
                        if (page === '...') {
                            return (
                                <Button
                                    key={`ellipsis-${index}`}
                                    variant="ghost"
                                    size="icon"
                                    disabled
                                    className="h-8 w-8"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            );
                        }

                        const pageNum = page as number;
                        return (
                            <Button
                                key={pageNum}
                                variant={safePagination.current_page === pageNum ? "default" : "outline"}
                                size="icon"
                                onClick={() => handlePageChange(pageNum)}
                                disabled={isLoading}
                                className="h-8 w-8"
                            >
                                {pageNum}
                            </Button>
                        );
                    })}
                </div>

                {/* Next Page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(safePagination.current_page + 1)}
                    disabled={safePagination.current_page === safePagination.total_pages || isLoading}
                    className="h-8 w-8"
                >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                </Button>

                {/* Last Page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(safePagination.total_pages)}
                    disabled={safePagination.current_page === safePagination.total_pages || isLoading}
                    className="h-8 w-8"
                >
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Last page</span>
                </Button>
            </div>
        </div>
    );
}