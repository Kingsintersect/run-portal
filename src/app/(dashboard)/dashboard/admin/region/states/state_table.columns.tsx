"use client"

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckboxColumn, DataTableColumnHeader } from "@/components/ui/datatable/DataTableColumnHeader";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { baseUrl } from "@/config";
import { DeleteSingleState, UpdateSingleState } from "@/app/actions/server.admin";
import { StatusCell } from "@/components/StatusToggle";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserTableColumType = {
    id: string
    name: string
    status: 1 | 0
    actions: string
}
const basePath = `${baseUrl}/dashboard/admin/region/states`;

export const state_columns: ColumnDef<Partial<UserTableColumType>>[] = [
    DataTableCheckboxColumn<Partial<UserTableColumType>>(),
    {
        accessorKey: "name",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State Title" />
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: (props) => <StatusCell
            {...props}
            method={UpdateSingleState}
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
            row={row.original  as UserTableColumType}
            onCopy={(id) => navigator.clipboard.writeText(id)}
            onDelete={DeleteSingleState}
            menu={[
                {title: "Edit Data", url:`${basePath}/${row.original.id}/edit`},
            ]}
        />,
    },
]
