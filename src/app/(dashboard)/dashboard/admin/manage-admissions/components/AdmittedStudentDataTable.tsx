"use client";

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { useDataTable } from '@/hooks/useDataTable'
// import { getAdmittedApplicants } from "@/app/actions/applications";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { EditIcon, NotebookTabs } from "lucide-react";
import { baseUrl } from "@/config";
import { UserInterface } from "@/config/Types";

const basePath = `${baseUrl}/dashboard/admin/manage-admissions`;
export type StudentTableColumnsType = {
    id: string
    first_name: string
    last_name: string
    other_name: string
    email: string
    reference: string
    phone_number: string
    // is_applied: any
    // admission_status: any
    // actions: string
}
export const AdmittedStudentDataTable = () => {
    type StatusKey = "FULLY_PAID" | "PART_PAID" | "NOT_PAID";
    const statusStyles = {
        FULLY_PAID: "bg-green-100 text-green-700 border-green-400",
        PART_PAID: "bg-yellow-100 text-yellow-800 border-yellow-400",
        NOT_PAID: "bg-red-100 text-red-700 border-red-400",
    };
    const {
        data = [],
        isLoading,
        error,
        total,
        pageIndex,
        pageSize,
        setPageIndex,
        setPageSize,
        search,
        setSearch,
        setFilter,
        setSorting,
    } = useDataTable({
        // fetchFn: getAdmittedApplicants,
        queryKey: ["getAllAdmittedStudents"],
        initialState: {
            pageIndex: 0,
            pageSize: 10,
            sortBy: "id",
            sortOrder: "desc",
        },
    });

    const columns: ColumnDef<Record<string, unknown>, UserInterface>[] = [
        // {
        //     accessorKey: "id",
        //     header: "Student ID",
        //     cell: ({ row }) => `${row.getValue("id")}`,
        // },
        {
            accessorKey: "first_name",
            header: "First Name",
            cell: ({ row }) => `${row.getValue("first_name")}`,
        },
        {
            accessorKey: "last_name",
            header: "Last Name",
            cell: ({ row }) => `${row.getValue("last_name")}`,
        },
        {
            accessorKey: "email",
            header: "Email Address",
            cell: ({ row }) => `${row.getValue("email")}`,
        },
        {
            accessorKey: "acceptance_fee_payment_status",
            header: "Acceptance Fee Status",
            cell: ({ row }) => {
                const statusKey = row.getValue("acceptance_fee_payment_status");
                const statusText = statusKey === "FULLY_PAID"
                    ? "FULLY PAID" : statusKey === "PART_PAID"
                        ? "PART PAID" : "NOT PAID";
                return (
                    <Badge className={`rounded-lg ${statusStyles[statusKey as StatusKey]}`} variant={row.getValue("acceptance_fee_payment_status") === "PAID" ? "default" : "destructive"}>
                        {statusText}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "tuition_payment_status",
            header: "Tuition Fee Status",
            cell: ({ row }) => {
                const statusKey = row.getValue("tuition_payment_status");
                const statusText = statusKey === "FULLY_PAID"
                    ? "FULLY PAID" : statusKey === "PART_PAID"
                        ? "PART PAID" : "NOT PAID";;
                return (
                    <Badge className={`rounded-lg ${statusStyles[statusKey as StatusKey]}`} variant={statusKey === "PAID" ? "default" : "destructive"}>
                        {statusText}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const student = row.original as StudentTableColumnsType;

                if (!student?.id) return null;

                return (
                    <ActionMenu
                        row={student}
                        onCopy={(id) => navigator.clipboard.writeText(id ?? "")}
                        menu={[
                            { title: "Review Application", url: `${baseUrl}/dashboard/update-application-form?id=${student.id}`, icon: NotebookTabs },
                            { title: "Update Record", url: `${basePath}/${student.id}`, icon: EditIcon },
                        ]}
                    />
                );
            },
        }

    ]

    return (
        <DataTable<Record<string, unknown>, UserInterface>
            columns={columns}
            fetchedData={data as unknown as Record<string, unknown>[]}
            isLoading={isLoading}
            error={error}
            title="Admission Management"
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalItems={total}
            onPaginationChange={(page, size) => {
                setPageIndex(page);
                setPageSize(size);
            }}
            onSortChange={(field, order) => {
                setSorting([{ id: field, desc: order === "desc" }]);
            }}
            onSearchChange={setSearch}
            onFilterChange={(updated) => {
                Object.entries(updated).forEach(([key, value]) =>
                    setFilter(key, value)
                );
            }}
            searchConfig={{
                searchableFields: ["first_name", "last_name", "othername", "email", "reference"],
                placeholder: "Search products by names, email or reference number...",
                search,
                setSearch,
            }}
            filterConfigs={[
                {
                    key: 'admission_status',
                    label: 'Admission Status',
                    options: [
                        { value: 'PENDING', label: 'PENDING' },
                        { value: 'ADMITTED', label: 'ADMITTED' },
                        { value: 'NOT_ADMITTED', label: 'NOT ADMITTED' }
                    ]
                },
            ]}
            getRowClickUrl={(product) => `${basePath}/${product.id}`}
            enableRowClick={false}
        />
    )
}

