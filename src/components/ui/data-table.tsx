"use client"

import { useState } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"

import {
    Input
} from "@/components/ui/input"

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Filter, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

interface FilterConfig {
    key: string
    label: string
    options: { value: string; label: string }[]
}

export interface SearchConfig {
    searchableFields: string[]
    placeholder?: string
    search: string
    setSearch: (value: string) => void
}

interface DataTableProps<TData extends Record<string, unknown>, TValue> {
    columns: ColumnDef<TData, TValue>[]
    fetchedData: TData[]
    isLoading: boolean
    error: unknown
    title?: string
    searchConfig?: SearchConfig
    filterConfigs?: FilterConfig[]
    pageIndex: number
    pageSize: number
    totalItems: number
    onPaginationChange: (page: number, size: number) => void
    onSortChange: (field: string, order: 'asc' | 'desc') => void
    onSearchChange?: (value: string) => void
    onFilterChange?: (filters: Record<string, string>) => void
    enableRowClick?: boolean
    getRowClickUrl?: (row: TData) => string
}

export function DataTable<TData extends Record<string, unknown>, TValue>({
    columns,
    fetchedData,
    isLoading,
    error,
    title = "Data Listing",
    searchConfig,
    filterConfigs = [],
    pageIndex,
    pageSize,
    totalItems,
    onPaginationChange,
    onSortChange,
    onSearchChange,
    onFilterChange,
    enableRowClick = true,
    getRowClickUrl,
}: DataTableProps<TData, TValue>) {
    const router = useRouter()
    const pathname = usePathname()

    const [searchTerm, setSearchTerm] = useState(searchConfig?.search ?? '')
    const [filters, setFilters] = useState<Record<string, string>>(
        filterConfigs.reduce((acc, config) => ({ ...acc, [config.key]: 'all' }), {})
    )

    const debouncedSearch = useDebouncedCallback((value: string) => {
        if (onSearchChange) onSearchChange(value)
    }, 500)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        debouncedSearch(value)
        // Reset to first page when searching
        onPaginationChange(0, pageSize)
    }

    const handleRowClick = (row: TData) => {
        if (!enableRowClick) return
        if (getRowClickUrl) router.push(getRowClickUrl(row))
        else if ('id' in row) router.push(`${pathname}/${row.id}`)
    }

    const table = useReactTable({
        data: fetchedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        manualPagination: true,
        pageCount: Math.ceil(totalItems / pageSize),
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
    })

    const handleFilterChange = (key: string, value: string) => {
        const updated = { ...filters, [key]: value }
        setFilters(updated)
        if (onFilterChange) onFilterChange(updated)
        // Reset to first page when filtering
        onPaginationChange(0, pageSize)
    }

    const handlePageSizeChange = (newSize: number) => {
        onPaginationChange(0, newSize) // Reset to first page when changing page size
    }

    // Calculate display values
    const startItem = totalItems > 0 ? (pageIndex * pageSize) + 1 : 0
    const endItem = Math.min((pageIndex + 1) * pageSize, totalItems)
    const totalPages = Math.ceil(totalItems / pageSize)

    // --- Loading ---
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">{[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}</div>
                </CardContent>
            </Card>
        )
    }

    // --- Error ---
    if (error) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center h-32">
                    <div className="text-center">
                        <p className="text-red-500 mb-2">Failed to load data</p>
                        <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="text-xl font-semibold">{title}</CardTitle>

                    {/* Search + Filters */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        {searchConfig && (
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={searchConfig.placeholder ?? "Search..."}
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10"
                                />
                            </div>
                        )}

                        {filterConfigs.map(config => (
                            <Select
                                key={config.key}
                                value={filters[config.key]}
                                onValueChange={(value) => handleFilterChange(config.key, value)}
                            >
                                <SelectTrigger className="w-36">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder={config.label} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All {config.label}</SelectItem>
                                    {config.options.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead
                                            key={header.id}
                                            onClick={() => {
                                                const id = header.column.id
                                                const isSorted = header.column.getIsSorted()
                                                const newOrder = isSorted === "asc" ? "desc" : "asc"
                                                onSortChange(id, newOrder)
                                            }}
                                            className="cursor-pointer select-none hover:bg-muted/50"
                                        >
                                            <div className="flex items-center">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() && (
                                                    <span className="ml-1">
                                                        {header.column.getIsSorted() === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {fetchedData.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        className={`${enableRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                                        onClick={() => handleRowClick(row.original)}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-8">
                                        <div className="text-muted-foreground">
                                            No results found.
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {totalItems > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
                        <div className="text-sm text-muted-foreground">
                            Showing {startItem} to {endItem} of {totalItems} entries
                        </div>

                        <div className="flex items-center gap-2">
                            <Select
                                value={String(pageSize)}
                                onValueChange={(val) => handlePageSizeChange(Number(val))}
                            >
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 20, 50].map(size => (
                                        <SelectItem key={size} value={String(size)}>
                                            {size} / page
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onPaginationChange(pageIndex - 1, pageSize)}
                                    disabled={pageIndex === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <div className="text-sm mx-2">
                                    Page {pageIndex + 1} of {totalPages}
                                </div>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onPaginationChange(pageIndex + 1, pageSize)}
                                    disabled={pageIndex >= totalPages - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
