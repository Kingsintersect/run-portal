"use client"

import React from "react"
import { FeeToggleCard } from "./FeeToggleCard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { UpdateRole } from "./UpdateRole"
import { ACCEPTANCE_FEE } from "@/config"
import { UserInterface } from "@/config/Types"

interface StatusManagementProps {
    studentData: UserInterface;
}

export default function StatusManagement({ studentData }: StatusManagementProps) {
    const fullname = studentData.first_name + " " + studentData.last_name;

    const handleFeeUpdateSuccess = (statusType: string, newStatus?: boolean) => {
        console.log(`${statusType} fee status updated to: ${newStatus ? 'Paid' : 'Unpaid'}`);
    }

    return (
        <div className="container mx-auto max-w-4xl">
            <Alert className="mb-6 bg-orange-50 border-orange-200">
                <Info className="h-5 w-5 text-orange-600" />
                <AlertTitle className="text-orange-800">Important</AlertTitle>
                <AlertDescription className="text-orange-700">
                    Updating fee status will automatically update the student's financial records and send a notification to the bursar's office.
                </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2">
                <FeeToggleCard
                    studentId={studentData.id ?? null}
                    studentRef={studentData.reference ?? "REF UNAVAILABLE"}
                    statusType="application_payment_status"
                    initialValue={Boolean(studentData.application_payment_status)}
                    feeAmount={studentData.amount ?? 0}
                    onSuccessfull={handleFeeUpdateSuccess}
                />

                <FeeToggleCard
                    studentId={studentData.id ?? null}
                    studentRef={studentData.reference ?? "REF UNAVAILABLE"}
                    statusType="acceptance_fee_payment_status"
                    initialValue={Boolean(studentData.acceptance_fee_payment_status)}
                    feeAmount={ACCEPTANCE_FEE}
                    onSuccessfull={handleFeeUpdateSuccess}
                />

                <FeeToggleCard
                    studentId={studentData.id ?? null}
                    studentRef={studentData.reference ?? "REF UNAVAILABLE"}
                    statusType="tuition_payment_status"
                    initialValue={Boolean(studentData.tuition_payment_status)}
                    feeAmount={studentData.tuition_amount_paid ?? 0}
                    onSuccessfull={handleFeeUpdateSuccess}
                />

                <UpdateRole
                    studentId={studentData.id ?? null}
                    studentName={(fullname.length > 2) ? fullname : "NAME UNAVAILABLE"}
                    statusType="role_assignment"
                    initialValue={studentData.role}
                    onSuccessfull={handleFeeUpdateSuccess}
                />
            </div>
        </div>
    )
}