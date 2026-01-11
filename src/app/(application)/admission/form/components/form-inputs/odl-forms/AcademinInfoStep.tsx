import { FileUploader } from '@/components/forms/FileUploader';
import { FormField } from '@/components/forms/FormField';
import { Checkbox } from '@/components/ui/checkbox';
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OLevels, Years } from '@/config';
import { ApplicationFormData, ODLApplication } from '@/schemas/admission-schema';
import React, { FC } from 'react'
import { Controller, FieldErrors, UseFormReturn } from 'react-hook-form';

interface AcademinInfoStepProps {
    form: UseFormReturn<ApplicationFormData>;
}
export const AcademinInfoStep: FC<AcademinInfoStepProps> = ({ form }) => {
    const { control, formState: { errors }, watch } = form;

    const isAwaiting = watch("awaiting_result");
    const combinnedresult = watch("combined_result");

    React.useEffect(() => {
        if (isAwaiting) {
            form.setValue('combined_result', '');
            form.setValue('first_sitting_type', '');
            form.setValue('first_sitting_year', '');
            form.setValue('first_sitting_exam_number', '');
            form.setValue('second_sitting_type', '');
            form.setValue('second_sitting_year', '');
            form.setValue('second_sitting_exam_number', '');
        }
    }, [isAwaiting, form]);

    const getODLError = (errors: FieldErrors<ApplicationFormData>, field: keyof ODLApplication) => {
        if (field in errors) {
            return errors[field as keyof FieldErrors<ApplicationFormData>];
        }
        return undefined;
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="max-w-xl mx-auto my-7">
                    <FileUploader
                        name="first_school_leaving"
                        control={control}
                        label="Primary School Leaving Certificate"
                        required={false}
                        accept=".pdf,.doc,.docx,.xls,.xlsx, image/*"
                        maxSize={10}
                        multiple={false}
                        maxFiles={1}
                    />
                </div>

                <Controller
                    name='awaiting_result'
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <Label
                            htmlFor={'awaiting_result'}
                            className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-green-600 has-[[aria-checked=true]]:bg-green-50"
                        >
                            <Checkbox
                                id="awaiting_result"
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                }}
                                className="data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                            />
                            <div className="grid gap-1.5 font-normal">
                                <p className="text-sm leading-none font-medium">
                                    Awaiting Result
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    Check this if you are awaiting your O'Level results
                                </p>
                            </div>
                        </Label>
                    )}
                />
            </div>

            {!isAwaiting && (
                <div className="w-full mt-6">
                    <Controller
                        name='combined_result'
                        control={control}
                        rules={{ required: !isAwaiting ? "Please select result type" : false }}
                        render={({ field }) => (
                            <div className='w-full flex flex-col gap-2 py-5'>
                                <InputGroup className='mb-0'>
                                    <Label className="text-sm font-medium mb-2 w-full px-3 py-2">Result Type *</Label>
                                    <InputGroupAddon align="block-end">
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value || ''}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem value="single_result" id="single_result" />
                                                <Label htmlFor="single_result">Single Result</Label>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem value="combined_result" id="combined_result" />
                                                <Label htmlFor="combined_result">Combined Result</Label>
                                            </div>
                                        </RadioGroup>
                                    </InputGroupAddon>
                                </InputGroup>
                                {getODLError(errors, 'combined_result') && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {getODLError(errors, 'combined_result')?.message}
                                    </div>
                                )}
                            </div>
                        )}
                    />
                </div>
            )}

            {/* Rest of your JSX remains the same but with proper validation */}
            {!isAwaiting && (combinnedresult === "single_result" || combinnedresult === "combined_result") && (
                <div className="w-full mt-6">
                    <hr className="my-6" />
                    <h3 className="text-lg font-semibold text-center mb-5">First Sitting (O'Level) Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 gap-x-10">
                        <div className="space-y-5">
                            <FormField
                                name="first_sitting_type"
                                control={control}
                                errors={errors}
                                label="Exam Type *"
                                type="select"
                                placeholder="e.g WAEC, NECO, GCE..."
                                options={OLevels}
                                rules={{ required: !isAwaiting ? "Exam type is required" : false }}
                            />
                            <FormField
                                name="first_sitting_year"
                                control={control}
                                errors={errors}
                                label="Exam Year *"
                                type="select"
                                placeholder="e.g 2010, 2015, 2020..."
                                options={Years}
                                rules={{ required: !isAwaiting ? "Exam year is required" : false }}
                            />
                            <FormField
                                name="first_sitting_exam_number"
                                control={control}
                                errors={errors}
                                label="Exam Number *"
                                placeholder="e.g 1234567890..."
                                rules={{ required: !isAwaiting ? "Exam number is required" : false }}
                            />
                        </div>
                        <div className="space-y-5">
                            <FileUploader
                                name="first_sitting_result"
                                control={control}
                                label="First Sitting (O'Level) Certificate"
                                required={false}
                                accept=".pdf,.doc,.docx,.xls,.xlsx, image/*"
                                maxSize={10}
                                multiple={false}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Similar updates for second sitting section */}
            {!isAwaiting && combinnedresult === "combined_result" && (
                <div className="w-full mt-6">
                    <hr className="my-6" />
                    <h3 className="text-lg font-semibold text-center mb-5">Second Sitting (O'Level) Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 gap-x-10">
                        <div className="space-y-5">
                            <FormField
                                name="second_sitting_type"
                                control={control}
                                errors={errors}
                                label="Exam Type *"
                                type="select"
                                placeholder="e.g WAEC, NECO, GCE..."
                                options={OLevels}
                                rules={{ required: "Exam type is required for combined results" }}
                            />
                            <FormField
                                name="second_sitting_year"
                                control={control}
                                errors={errors}
                                label="Exam Year *"
                                type="select"
                                placeholder="e.g 2010, 2015, 2020..."
                                options={Years}
                                rules={{ required: !isAwaiting ? "Exam year is required" : false }}
                            />
                            <FormField
                                name="second_sitting_exam_number"
                                control={control}
                                errors={errors}
                                label="Exam Number *"
                                placeholder="e.g 1234567890..."
                                rules={{ required: !isAwaiting ? "Exam number is required" : false }}
                            />
                        </div>
                        <div className="space-y-5">
                            <FileUploader
                                name="second_sitting_result"
                                control={control}
                                label="Second Sitting (O'Level) Certificate"
                                required={false}
                                accept=".pdf,.doc,.docx,.xls,.xlsx, image/*"
                                maxSize={10}
                                multiple={false}
                            />
                        </div>
                    </div>
                </div>
            )}

            {!isAwaiting && (
                <div className="mt-6">
                    <FileUploader
                        name="other_documents"
                        control={control}
                        label="Other Academic Qualification Documents (Optional)"
                        required={false}
                        accept=".pdf,.doc,.docx,.xls,.xlsx, image/*"
                        maxSize={10}
                        multiple={true}
                        maxFiles={5}
                    />

                </div>
            )}
        </>
    );
}
