"use client";

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { notify } from '@/contexts/ToastProvider';
import { updateStudentStatusField } from "@/app/actions/admin"
import { extractErrorMessages } from "@/lib/errorsHandler"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge";
import { statusColors } from "../update.types";
import { Input } from "@/components/ui/input";

interface StatusToggleCardProps {
    studentId: number | null,
    studentRef: string
    statusType: "application_payment_status" | "acceptance_fee_payment_status" | "tuition_payment_status" | "role_assignment";
    initialValue: boolean
    feeAmount: number
    onSuccessfull?: (statusType: string, newStatus: boolean) => void
    className?: string
}

export function FeeToggleCard({
    studentId,
    studentRef,
    statusType,
    initialValue,
    feeAmount,
    onSuccessfull,
    className,
}: StatusToggleCardProps) {
    const [isPaid, setIsPaid] = useState(initialValue);
    const [tuitionAmount, setTuitionAmount] = useState("");
    const [amountError, setAmountError] = useState<string | null>(null);
    const [statusError, setStatusError] = useState<string | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { access_token } = useAuth();

    const mutation = useMutation<
        Awaited<ReturnType<typeof updateStudentStatusField>>,
        Error,
        Record<string, string>
    >({
        mutationFn: (formData) => updateStudentStatusField(formData, access_token ?? ""),
        onSuccess: (result, variables) => {
            const { isPaid, studentRef } = variables;
            toast.success("Update Successful", {
                description: `Fee for ${studentRef} has been marked as ${isPaid ? "paid" : "unpaid"
                    }.`,
            })

            if (onSuccessfull) {
                onSuccessfull(statusType, Boolean(isPaid));
            }
        },
        onError: (error) => {
            console.error("Mutation Error:", error);

            const errorMessages = extractErrorMessages(error);
            setErrorMessage(error.message);

            errorMessages.forEach((msg) => {
                notify({ message: msg, variant: "error", timeout: 10000 });
            });
        },
    });


    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage(null);
        setStatusError(null);
        setAmountError(null);

        if (!studentId) return;

        // if (!isPaid) {
        //     setStatusError("Please mark the status as paid before submitting.");
        //     return;
        // }

        const status = String(Number(isPaid));
        const formData: Record<string, string> = {
            [statusType]: status,
            id: String(studentId),
            studentRef,
        };

        if (statusType === "tuition_payment_status") {
            if (!tuitionAmount.trim()) {
                setAmountError("Tuition amount is required.");
                return;
            }

            const amount = parseFloat(tuitionAmount);
            if (isNaN(amount) || amount <= 0) {
                setAmountError("Amount must be a number greater than 0.");
                return;
            }

            formData["tuition_amount_paid"] = tuitionAmount.trim();
        }

        mutation.mutate(formData);
    };

    const handleToggleChange = (checked: boolean) => {
        setIsPaid(checked);
        setStatusError(null);
    };


    const titleMap: Record<string, string> = {
        application_payment_status: "Application Fee",
        acceptance_fee_payment_status: "Acceptance Fee",
        tuition_payment_status: "Tuition Fee",
        role_assignment: "Role Assignment",
    }

    const feeTypeTitle = titleMap[statusType] || "Unknown Fee";
    const statusMessage = isPaid ? "Paid" : "Unpaid";

    useEffect(() => {
        if (mutation.isSuccess) {
            const timeout = setTimeout(() => {
                mutation.reset();
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [mutation, mutation.isSuccess, statusType]);

    return (
        <Card className={cn("border-cyan-100 shadow-sm -mt-20", className)} style={{ marginTop: 0 }}>
            <CardHeader className="bg-cyan-50 pb-4">
                <CardTitle className="text-lg text-cyan-800">{feeTypeTitle} Status</CardTitle>
                <CardDescription className="text-orange-600">
                    {statusType === 'acceptance_fee_payment_status'
                        ? 'Update the acceptance fee payment status'
                        : statusType === 'application_payment_status'
                            ? 'Update the Application Fee payment status'
                            : statusType === 'role_assignment'
                                ? 'Assign Role To This UserInterface'
                                : 'Update the tuition fee payment status'}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-orange-700">Amount: ₦{feeAmount.toLocaleString()}</div>
                            </div>
                            <div className="text-right">
                                <Badge className={statusColors[isPaid ? "Completed" : (isPaid && feeAmount > 0) ? "Partial" : "Pending"]}>
                                    {statusMessage}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor={`${statusType}-toggle-${studentRef}`} className="text-sm font-medium">
                                    Mark as {isPaid ? 'unpaid' : 'paid'}
                                </Label>
                                <Switch
                                    id={`${statusType}-toggle-${studentRef}`}
                                    checked={isPaid}
                                    onCheckedChange={handleToggleChange}
                                    disabled={mutation.isPending}
                                    className="data-[state=checked]:bg-orange-500"
                                />
                            </div>
                            {statusError && <p className="text-sm text-red-600">{statusError}</p>}
                        </div>

                        {statusType === "tuition_payment_status" && isPaid && (
                            <div className="grid w-full items-center gap-4 pt-5">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="tuition_amount_paid">Tuition Amount Paid</Label>
                                    <Input
                                        id="tuition_amount_paid"
                                        name="tuition_amount_paid"
                                        value={tuitionAmount}
                                        onChange={(e) => setTuitionAmount(e.target.value)}
                                        placeholder="Enter amount paid"
                                    />
                                    {amountError && (
                                        <p className="text-sm text-red-600">{amountError}</p>
                                    )}
                                </div>
                            </div>
                        )}


                        {mutation.isError && errorMessage && (
                            <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-sm text-red-800 text-wrap overflow-x-hidden max-h-52">
                                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                                <p>{errorMessage || 'An error occurred while updating the fee status.'}</p>
                            </div>
                        )}
                    </div>
                </form>
            </CardContent>

            <CardFooter className="bg-gray-50 border-t border-cyan-100 flex justify-end">
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={mutation.isPending || mutation.isSuccess}
                    className={cn(
                        "transition-colors",
                        mutation.isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-cyan-600 hover:bg-cyan-700",
                        "text-white"
                    )}
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : mutation.isSuccess ? (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Updated
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}