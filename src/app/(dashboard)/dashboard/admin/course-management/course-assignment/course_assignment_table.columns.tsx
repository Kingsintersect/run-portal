"use client"

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckboxColumn, DataTableColumnHeader } from "@/components/ui/datatable/DataTableColumnHeader";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { baseUrl } from "@/config";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CourseAssignmentTableColumType = {
    id: string
    short_code: string
    actions: string
}
const basePath = `${baseUrl}/dashboard/admin/course-management/course-assignment`;

export const course_assignment_columns: ColumnDef<Partial<CourseAssignmentTableColumType>>[] = [
    DataTableCheckboxColumn<Partial<CourseAssignmentTableColumType>>(),
    {
        accessorKey: "short_code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="COURSE CODE" />
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionMenu
            row={row.original as CourseAssignmentTableColumType}
            onCopy={(id) => navigator.clipboard.writeText(id)}
            // onDelete={DeleteSingleCourseAssignment}
            menu={[
                { title: "Edit Data", url: `${basePath}/${row.original.id}/details` },
            ]}
        />,
    },
]

