"use client"

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckboxColumn, DataTableColumnHeader } from "@/components/ui/datatable/DataTableColumnHeader";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { StatusCell } from "@/components/StatusToggle";
import { DeleteSingleLocalGov, UpdateSingleLocalGov } from "@/app/actions/server.admin";
import { baseUrl } from "@/config";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type LgaTableColumType = {
    id: string
    name: string
    state_id: string
    status: 1 | 0
    actions: string
}
const basePath: string = `${baseUrl}/dashboard/admin/region/local-gov`;

export const lga_columns: ColumnDef<Partial<LgaTableColumType>>[] = [
    DataTableCheckboxColumn<Partial<LgaTableColumType>>(),
    {
        accessorKey: "name",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: (props) => <StatusCell
            {...props}
            method={UpdateSingleLocalGov}
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
            row={row.original  as LgaTableColumType}
            onCopy={(id) => navigator.clipboard.writeText(id)}
            onDelete={DeleteSingleLocalGov}
            menu={[
                {title: "Edit Data", url:`${basePath}/${row.original.id}/edit?parentId=${row.original.state_id}`},
            ]}
        />,
    },
]
