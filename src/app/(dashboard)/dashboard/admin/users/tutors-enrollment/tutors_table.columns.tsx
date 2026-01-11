"use client"

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckboxColumn, DataTableColumnHeader } from "@/components/ui/datatable/DataTableColumnHeader";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { baseUrl } from "@/config";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserTableColumnsType = {
    id: string
    first_name: string
    last_name: string
    email: string
    program: string
    department_id: string
    // actions: string
}

const basePath = `${baseUrl}/dashboard/admin/users/tutors-enrollment`;

export const tutors_columns: ColumnDef<Partial<UserTableColumnsType>>[] = [
    DataTableCheckboxColumn<Partial<UserTableColumnsType>>(),
    {
        accessorKey: "first_name",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First Name" />
        ),
    },
    {
        accessorKey: "last_name",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Name" />
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "program",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Program" />
        ),
    },
    {
        accessorKey: "department_id",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionMenu
            row={row.original as UserTableColumnsType}
            onCopy={(id) => navigator.clipboard.writeText(id ??"")}
            menu={[
                {title: "Enrollment", url:`${basePath}/${row.original.id}/enrollment`},
            ]}
        />,
    },
]
