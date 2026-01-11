"use client"

import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckboxColumn, DataTableColumnHeader } from "@/components/ui/datatable/DataTableColumnHeader";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { baseUrl } from "@/config";
import { CheckCircleIcon, NotebookTabs, EditIcon, XCircle } from "lucide-react";
import { AdmissionStatusType } from "@/config/Types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type StudentTableColumnsType = {
    id: string
    first_name: string
    last_name: string
    other_name: string
    email: string
    reference: string
    phone_number: string
    is_applied: string | number
    admission_status: AdmissionStatusType
    // actions: string
}

const basePath = `${baseUrl}/dashboard/admin/users`;

export const student_columns: ColumnDef<Partial<StudentTableColumnsType>>[] = [
    DataTableCheckboxColumn<Partial<StudentTableColumnsType>>(),
    {
        accessorKey: "first_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="FIRST NAME" />
        ),
    },
    {
        accessorKey: "last_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="LAST NAME" />
        ),
    },
    {
        accessorKey: "other_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="OTHER NAMES" />
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="EMAIL" />
        ),
    },
    {
        accessorKey: "reference",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="REFERENCE" />
        ),
    },
    {
        accessorKey: "phone_number",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="PHONE NUMBER" />
        ),
    },
    {
        accessorKey: "is_applied",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="APPLIED" />
        ),
        cell: ({ row }) => {
            const student = row.original as StudentTableColumnsType;

            return student.is_applied === 1 ? (
                <span className="text-green-700 font-semibold">
                    <CheckCircleIcon width={25} height={25} />
                </span>
            ) : (
                <span className="text-red-700 font-semibold">
                    <XCircle width={25} height={25} />
                </span>
            );
        },
    },
    {
        accessorKey: "admission_status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ADMISSION STATUS" />
        ),
        cell: ({ row }) => {
            const student = row.original as StudentTableColumnsType;
            switch (student.admission_status) {
                case "ADMITTED":
                    return <span className="text-green-400 font-semibold">{student.admission_status}</span>;
                case "PENDING":
                    return <span className="text-cyan-400 font-semibold">{student.admission_status}</span>;
                case "NOT_ADMITTED":
                    return <span className="text-red-400 font-semibold">{student.admission_status}</span>;
                default:
                    return <span className="text-gray-400 font-semibold">Unknown</span>;
            }
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionMenu
            row={row.original as StudentTableColumnsType}
            onCopy={(id) => navigator.clipboard.writeText(id ?? "")}
            menu={[
                { title: "Review Application", url: `${basePath}/${row.original.id}`, icon: NotebookTabs },
                { title: "Update Record", url: `${basePath}/${row.original.id}/update`, icon: EditIcon },
            ]}
        />,
    },
]
