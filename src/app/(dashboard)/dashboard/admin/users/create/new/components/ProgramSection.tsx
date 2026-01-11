import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentFormData, Program } from "../student.validation";

interface ProgramSectionProps {
    control: Control<StudentFormData>;
    parentPrograms: Program[];
    childPrograms: Program[];
    isProgramsLoading: boolean;
    onProgramChange: (value: string) => void;
    onChildProgramChange: () => void;
}

export const ProgramSection: React.FC<ProgramSectionProps> = ({
    control,
    parentPrograms,
    childPrograms,
    isProgramsLoading,
    onProgramChange,
    onChildProgramChange,
}) => {
    if (isProgramsLoading) {
        return <div>Loading programme and courses...</div>;
    }

    return (
        <div className="programs space-y-5">
            <h2 className="text-center text-lg text-gray-600">Programme and courses</h2>

            {parentPrograms?.length && (
                <FormField
                    control={control}
                    name="faculty_id"
                    render={({ field }) => (
                        <FormItem>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    onProgramChange(value);
                                }}
                                value={field.value}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a programme" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Programme</SelectLabel>
                                        {parentPrograms.map((item, i) => (
                                            <SelectItem key={i} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {childPrograms?.length > 0 && (
                <FormField
                    control={control}
                    name="department_id"
                    render={({ field }) => (
                        <FormItem>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    onChildProgramChange();
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a course" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Courses</SelectLabel>
                                        {childPrograms.map((item, i) => (
                                            <SelectItem key={i} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
};