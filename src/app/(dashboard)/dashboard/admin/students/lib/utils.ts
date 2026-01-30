import { PaginationInfo } from '../types/student';

export const getSafePagination = (pagination: PaginationInfo | null | undefined): PaginationInfo => ({
    current_page: pagination?.current_page ?? 1,
    total_pages: pagination?.total_pages ?? 0,
    total_items: pagination?.total_items ?? 0,
    page_size: pagination?.page_size ?? 25,
});

// Optional: Type guard to check if pagination is valid
export const isValidPagination = (pagination: PaginationInfo): pagination is PaginationInfo => {
    return (
        pagination &&
        typeof pagination.current_page === 'number' &&
        typeof pagination.total_pages === 'number' &&
        typeof pagination.total_items === 'number' &&
        typeof pagination.page_size === 'number'
    );
};