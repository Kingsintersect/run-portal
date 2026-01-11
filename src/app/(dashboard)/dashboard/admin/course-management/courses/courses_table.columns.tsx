"use client"

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckboxColumn, DataTableColumnHeader } from "@/components/ui/datatable/DataTableColumnHeader";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { DeleteSingleCourse } from "@/app/actions/server.admin";
import { baseUrl } from "@/config";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CoursesTableColumType = {
    id: string
    course_title: string
    course_code: string
    actions: string
}
const basePath = `${baseUrl}/dashboard/admin/course-management/courses`;

export const courses_columns: ColumnDef<Partial<CoursesTableColumType>>[] = [
    DataTableCheckboxColumn<Partial<CoursesTableColumType>>(),
    {
        accessorKey: "course_title",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="TITLE" />
        ),
    },
    {
        accessorKey: "course_code",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CODE" />
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionMenu
            row={row.original  as CoursesTableColumType}
            onCopy={(id) => navigator.clipboard.writeText(id)}
            onDelete={DeleteSingleCourse}
            menu={[
                {title: "Edit Data", url:`${basePath}/${row.original.id}/edit`},
            ]}
        />,
    },
]

