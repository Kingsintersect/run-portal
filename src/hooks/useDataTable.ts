import { useState, useEffect, useMemo } from 'react'
import { useApplicantsData } from './useApplicantsData'
import { SortingState } from '@tanstack/react-table'

export interface UseDataTableOptions {
    pageIndex: number
    pageSize: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    search?: string
    filters?: Record<string, string>
}

export interface UseDataTableHookProps {
    queryKey: string[]
    initialState?: Partial<UseDataTableOptions>
}

export function useDataTable({
    queryKey,
    initialState = {}
}: UseDataTableHookProps) {
    const [pageIndex, setPageIndex] = useState(initialState.pageIndex ?? 0)
    const [pageSize, setPageSize] = useState(initialState.pageSize ?? 10)
    const [sortBy, setSortBy] = useState(initialState.sortBy ?? 'id')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialState.sortOrder ?? 'desc')
    const [search, setSearch] = useState(initialState.search ?? '')
    const [filters, setFilters] = useState<Record<string, string>>(initialState.filters ?? {})
    const [sorting, setSorting] = useState<SortingState>([])

    // Get all applicants data from Zustand store
    const { allApplicants, isLoading, error, refetchData, totalCount } = useApplicantsData()

    // Sync sorting state with sortBy and sortOrder
    useEffect(() => {
        if (sorting.length > 0) {
            const sort = sorting[0]
            setSortBy(sort.id)
            setSortOrder(sort.desc ? 'desc' : 'asc')
            setPageIndex(0) // Reset to first page when sorting changes
        }
    }, [sorting])

    const setFilter = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
        setPageIndex(0) // Reset to first page when filters change
    }

    // Client-side filtering, sorting, and pagination
    const processedData = useMemo(() => {
        if (!allApplicants.length) return []

        let filteredData = [...allApplicants]

        // Apply search
        if (search) {
            const searchLower = search.toLowerCase()
            filteredData = filteredData.filter(applicant =>
                ['first_name', 'last_name', 'email', 'reference'].some(field =>
                    String(applicant[field as keyof typeof applicant] || '').toLowerCase().includes(searchLower)
                )
            )
        }

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== 'all') {
                filteredData = filteredData.filter(applicant =>
                    String(applicant[key as keyof typeof applicant]) === value
                )
            }
        })

        // Apply sorting
        filteredData.sort((a, b) => {
            const aValue = a[sortBy as keyof typeof a]
            const bValue = b[sortBy as keyof typeof b]

            if (sortOrder === 'asc') {
                return String(aValue).localeCompare(String(bValue))
            } else {
                return String(bValue).localeCompare(String(aValue))
            }
        })

        return filteredData
    }, [allApplicants, search, filters, sortBy, sortOrder])

    // Apply pagination
    const paginatedData = useMemo(() => {
        const startIndex = pageIndex * pageSize
        const endIndex = startIndex + pageSize
        return processedData.slice(startIndex, endIndex)
    }, [processedData, pageIndex, pageSize])

    // Reset to first page when search changes
    useEffect(() => {
        setPageIndex(0)
    }, [search])

    return {
        data: paginatedData,
        total: processedData.length, // Total after filtering
        totalAll: allApplicants.length, // Total all records
        isLoading,
        error,
        pageIndex,
        pageSize,
        setPageIndex,
        setPageSize,
        sorting,
        setSorting,
        sortBy,
        sortOrder,
        setSortBy,
        setSortOrder,
        search,
        setSearch,
        filters,
        setFilter,
        refetchData,
    }
}
