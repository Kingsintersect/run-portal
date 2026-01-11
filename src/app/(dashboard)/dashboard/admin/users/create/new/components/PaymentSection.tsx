import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentFormData } from "../student.validation";

interface PaymentSectionProps {
    control: Control<StudentFormData>;
    showTuitionAmount: boolean;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
    control,
    showTuitionAmount,
}) => {
    return (
        <div className="payments space-y-5">
            <h2 className="text-center text-lg text-gray-600">Payment Statuses</h2>

            <FormField
                control={control}
                name="application_payment_status"
                render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Application payment status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Application Payment Status</SelectLabel>
                                    <SelectItem value="FULLY_PAID">FULLY PAID</SelectItem>
                                    <SelectItem value="UNPAID">UNPAID</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="acceptance_fee_payment_status"
                render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Acceptance payment status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Acceptance Payment Status</SelectLabel>
                                    <SelectItem value="FULLY_PAID">FULLY PAID</SelectItem>
                                    <SelectItem value="PART_PAID">PART PAID</SelectItem>
                                    <SelectItem value="UNPAID">UNPAID</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="tuition_payment_status"
                render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Tuition payment status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Tuition Payment Status</SelectLabel>
                                    <SelectItem value="FULLY_PAID">FULLY PAID</SelectItem>
                                    <SelectItem value="PART_PAID">PART PAID</SelectItem>
                                    <SelectItem value="UNPAID">UNPAID</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {showTuitionAmount && (
                <FormField
                    control={control}
                    name="tuition_amount_paid"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tuition Amount Paid</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter tuition amount paid"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
};