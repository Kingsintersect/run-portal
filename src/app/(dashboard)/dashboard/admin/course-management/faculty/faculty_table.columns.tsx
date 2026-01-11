"use client"

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckboxColumn, DataTableColumnHeader } from "@/components/ui/datatable/DataTableColumnHeader";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { DeleteSingleFaculty, UpdateSingleFaculty } from "@/app/actions/server.admin";
import { StatusCell } from "@/components/StatusToggle";
import { baseUrl } from "@/config";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type FacultyTableColumType = {
    id: string
    faculty_name: string
    status: 1 | 0
    actions: string
}
const basePath = `${baseUrl}/dashboard/admin/course-management/faculty`;

export const faculty_columns: ColumnDef<Partial<FacultyTableColumType>>[] = [
    DataTableCheckboxColumn<Partial<FacultyTableColumType>>(),
    {
        accessorKey: "faculty_name",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Faculty Name" />
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: (props) => <StatusCell
            {...props}
            method={UpdateSingleFaculty}
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
            row={row.original  as FacultyTableColumType}
            onCopy={(id) => navigator.clipboard.writeText(id)}
            onDelete={DeleteSingleFaculty}
            menu={[
                {title: "Edit Data", url:`${basePath}/${row.original.id}/edit`},
            ]}
        />,
    },
]

