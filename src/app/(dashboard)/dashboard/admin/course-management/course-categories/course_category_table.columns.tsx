"use client"

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckboxColumn, DataTableColumnHeader } from "@/components/ui/datatable/DataTableColumnHeader";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { DeleteSingleCourseCategory, UpdateSingleCourseCategory } from "@/app/actions/server.admin";
import { StatusCell } from "@/components/StatusToggle";
import { baseUrl } from "@/config";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CourseCategoryTableColumType = {
    id: string
    short_code: string
    semester: string
    level: string
    status: 1 | 0
    actions: string
}
const basePath = `${baseUrl}/dashboard/admin/course-management/course-categories`;

export const course_category_columns: ColumnDef<Partial<CourseCategoryTableColumType>>[] = [
    DataTableCheckboxColumn<Partial<CourseCategoryTableColumType>>(),
    {
        accessorKey: "short_code",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="COURSE CODE" />
        ),
    },
    {
        accessorKey: "semester",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SEMESTER" />
        ),
    },
    {
        accessorKey: "level",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="LEVEL" />
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: (props) => <StatusCell
            {...props}
            method={UpdateSingleCourseCategory}
            row={{ 
                original: { 
                    id: props.row.original.id || "unknown",  // Provide a default value 
                    status: props.row.original.status ?? 0   // Default status to 0 if undefined
                } 
            }}
        />,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionMenu
            row={row.original  as CourseCategoryTableColumType}
            onCopy={(id) => navigator.clipboard.writeText(id)}
            onDelete={DeleteSingleCourseCategory}
            menu={[
                {title: "Edit Data", url:`${basePath}/${row.original.id}/edit`},
            ]}
        />,
    },
]

