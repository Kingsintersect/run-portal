"use client"

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckboxColumn, DataTableColumnHeader } from "@/components/ui/datatable/DataTableColumnHeader";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { StatusCell } from "@/components/StatusToggle";
import { DeleteSingleDepartment, UpdateSingleDepartment } from "@/app/actions/server.admin";
import { baseUrl } from "@/config";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DepartmentTableColumType = {
    id: string
    department_name: string
    status: 1 | 0
    actions: string
}
const basePath = `${baseUrl}/dashboard/admin/course-management/department`;

export const department_columns: ColumnDef<Partial<DepartmentTableColumType>>[] = [
    DataTableCheckboxColumn<Partial<DepartmentTableColumType>>(),
    {
        accessorKey: "department_name",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department Name" />
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: (props) => <StatusCell
            {...props}
            method={UpdateSingleDepartment}
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
            row={row.original  as DepartmentTableColumType}
            onCopy={(id) => navigator.clipboard.writeText(id)}
            onDelete={DeleteSingleDepartment}
            menu={[
                {title: "Edit Data", url:`${basePath}/${row.original.id}/edit`},
            ]}
        />,
    },
]
