"use client";

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { Loader2, Save, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { notify } from '@/contexts/ToastProvider';
import { updateStudentStatusField } from "@/app/actions/admin"
import { extractErrorMessages } from "@/lib/errorsHandler"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Roles } from "@/config";

interface UpdateRoleProps {
    studentId: number | null,
    studentName: string
    statusType: "application_payment_status" | "acceptance_fee_payment_status" | "tuition_payment_status" | "role_assignment";
    initialValue: string
    onSuccessfull?: (statusType: string, newStatus?: boolean) => void
    className?: string
}

export function UpdateRole({
    studentId,
    statusType,
    initialValue,
    onSuccessfull,
    className,
}: UpdateRoleProps) {
    const [newRole, setNewRole] = useState(initialValue);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { access_token } = useAuth();

    const mutation = useMutation({
        mutationFn: (formData: Record<string, string>) => updateStudentStatusField(formData, access_token ?? ""),
        onSuccess: (result, variables) => {
            const { studentName, onSuccess, role } = variables;

            toast.success("Update Successful", {
                description: `${role} role for ${studentName} has been updated`,
            })

            if (onSuccess && onSuccessfull) {
                onSuccessfull(statusType);
            }
        },
        onError: (error) => {
            const errorMessages = extractErrorMessages(error);
            setErrorMessage(error.message);
            errorMessages.forEach((msg) => {
                notify({ message: msg, variant: "error", timeout: 10000 });
            });
        }
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage(null);

        if (!studentId) return;

        if (!newRole) {
            setErrorMessage("Please select a role before submitting.");
            return;
        }

        const formData: Record<string, string> = {
            role: String(newRole),
            id: String(studentId),
        };

        mutation.mutate(formData);
    };

    const titleMap: Record<string, string> = {
        role_assignment: "Role Assignment",
    }

    const feeTypeTitle = titleMap[statusType] || "Unknown Fee";

    useEffect(() => {
        if (mutation.isSuccess) {
            const timeout = setTimeout(() => {
                mutation.reset();
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [mutation, mutation.isSuccess]);

    return (
        <Card className={cn("border-cyan-100 shadow-sm -mt-20", className)} style={{ marginTop: 0 }}>
            <CardHeader className="bg-cyan-50 pb-4">
                <CardTitle className="text-lg text-cyan-800">{feeTypeTitle} Status</CardTitle>
                <CardDescription className="text-orange-600">
                    {statusType === 'role_assignment'
                        ? 'Assign Role To This UserInterface'
                        : 'Update...'}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="w-full flex flex-col space-y-1.5">
                            <Label htmlFor="role">Select UserInterface Role</Label>
                            <Select
                                value={newRole}
                                onValueChange={(val) => setNewRole(val)}
                            >
                                <SelectTrigger id="role" className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {Object.entries(Roles).map(([key, value]) => (
                                        <SelectItem key={key} value={value}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>


                        {(mutation.isError || errorMessage) && (
                            <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-sm text-red-800 text-wrap overflow-x-hidden max-h-52">
                                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                                <p>{errorMessage || 'An error occurred while assigning role to user.'}</p>
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