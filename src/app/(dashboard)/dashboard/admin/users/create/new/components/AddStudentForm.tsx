"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormFieldSet } from "@/components/ui/inputs/FormFields";
import { useStudentForm } from "@/hooks/useStudentForm";
import { usePrograms } from "@/hooks/usePrograms";
import { PersonalInformationSection } from "./PersonalInformationSection";
import { ProgramSection } from "./ProgramSection";
import { PaymentSection } from "./PaymentSection";
import { LoginInformationSection } from "./LoginInformationSection";

export default function AddStudentForm() {
    const { form, handleSubmit, handleCancel, isLoading, showTuitionAmount } = useStudentForm();
    const {
        parentPrograms,
        childPrograms,
        isProgramsLoading,
        handleProgramChange,
        handleChildProgramChange
    } = usePrograms();

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-5xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl text-site-b font-bold">Add New Student</CardTitle>
                    <CardDescription className="text-site-a">
                        Enter the student's information below to add them to the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Personal Information Section */}
                                <PersonalInformationSection control={form.control} />

                                {/* Additional Information Section */}
                                <FormFieldSet legend="Additional Information" classList="bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-4">
                                        <ProgramSection
                                            control={form.control}
                                            parentPrograms={parentPrograms || []}
                                            childPrograms={childPrograms || []}
                                            isProgramsLoading={isProgramsLoading}
                                            onProgramChange={handleProgramChange}
                                            onChildProgramChange={() => handleChildProgramChange(form.setValue)}
                                        />

                                        <PaymentSection
                                            control={form.control}
                                            showTuitionAmount={showTuitionAmount}
                                        />
                                    </div>
                                </FormFieldSet>

                                {/* Login Information Section */}
                                <LoginInformationSection control={form.control} />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-site-b-dark hover:bg-site-b"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Add Student"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}