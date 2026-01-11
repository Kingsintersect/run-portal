import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PaymentStatus } from '@/lib/definitions'
import React from 'react'

interface SetPaymentStatusRecordProps {
    status: PaymentStatus,
    statusType: "application_payment_status" | "acceptance_fee_payment_status" | "tuition_payment_status",
    statusError: string | null,
    handleStatusChange: (status: string) => void,
    amount?: string | number,
    setAmount?: (amount: string) => void,
}
const SetPaymentStatusRecord = ({
    status,
    statusType,
    statusError,
    handleStatusChange,
    amount,
    setAmount,
}: SetPaymentStatusRecordProps) => {

    const titleMap: Record<string, string> = {
        application_payment_status: "Application Fee",
        acceptance_fee_payment_status: "Acceptance Fee",
        tuition_payment_status: "Tuition Fee",
    }

    const feeTypeTitle = titleMap[statusType] || "Unknown Fee";

    return (
        <div>
            <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between space-x-2">
                    <Select
                        onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={feeTypeTitle} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>
                                    {statusType === 'acceptance_fee_payment_status'
                                        ? 'Set acceptance fee payment status'
                                        : statusType === 'application_payment_status'
                                            ? 'Set Application Fee payment status'
                                            : 'Set tuition fee payment status'}
                                </SelectLabel>
                                <SelectItem value={'FULLY_PAID'}>Paid</SelectItem>
                                <SelectItem value={'PART_PAID'}>Part Paid</SelectItem>
                                <SelectItem value={'UNPAID'}>Unpaid</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {statusError && <p className="text-sm text-red-600">{statusError}</p>}

                {statusType === "tuition_payment_status" && status !== "UNPAID" && (
                    <div className="grid w-full items-center gap-4 pt-5">
                        <div className="flex flex-col space-y-1.5">
                            <Input
                                id="tuition_amount_paid"
                                name="tuition_amount_paid"
                                value={amount}
                                onChange={(e) => setAmount && setAmount(e.target.value)}
                                placeholder="Enter amount paid"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SetPaymentStatusRecord
