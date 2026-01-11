"use client";

import { AlertCircle, CheckCircle, Loader2, Save, X } from "lucide-react";
import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { SuccessScreen } from "./components/SuccessScreen";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getAPIFriendlyError, getReactHookFormErrorMessages } from '@/lib/errorsHandler';
import { StepErrorDisplay } from "@/components/forms/FormErrorList";
import Link from "next/link";
import { ProgramType, SelectedProgramType, SITE_TITLE } from "@/config";
import TermsAndConditions from "./components/form-inputs/TermsAndConditionsContent";
import { ApplicationFormData } from "@/schemas/admission-schema";
import { UseMutationResult } from "@tanstack/react-query";
import { useApplicationForm, useFormPersistence, useFormSubmission } from "./lib/admission-form-hooks";
import { STEP_TO_SECTION_MAP, StepRenderer } from "./lib/utils";

// ============= MAIN COMPONENT =============
const AdmissionForm = () => {
    const { user, access_token, updateUserInState, refreshUserData } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [lauched, setILunched] = useState(false);
    const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});

    const { steps, programType, getDefaultValues, ...form } = useApplicationForm(
        SelectedProgramType as ProgramType
    );
    const { handleSubmit, formState: { errors, isValid }, trigger, reset, getValues } = form;
    const fieldsWithErrors = Object.keys(errors);

    // REMOVE this useEffect entirely
    // useEffect(() => {
    //     trigger();
    //     console.log('Form values on mount:', getValues());
    // }, [getValues(), trigger]);

    const { isSaving, saveProgress, clearProgress } = useFormPersistence(
        reset,
        getValues,
        steps,
        currentStep,
        programType
    );

    const { submitApplicationMutation, isSubmitted } = useFormSubmission(
        String(access_token),
        programType,
        user,
        updateUserInState,
        refreshUserData,
        clearProgress
    );

    const handleStepNavigation = async (direction: 'next' | 'prev') => {
        if (direction === 'prev') {
            if (currentStep > 0) setCurrentStep(currentStep - 1);
            return;
        }
        // DEBUGGING PURPOSE
        // Trigger validation for the entire form to ensure overall validity.
        // This is the key to solving the disabled submit button issue.
        // const isStepValid = await trigger();
        const stepConfig = steps[currentStep];
        const values = getValues();
        const fieldsToValidate = typeof stepConfig.getFields === 'function'
            ? stepConfig.getFields(values)
            : stepConfig.fields || [];

        const isStepValid = await trigger(fieldsToValidate as (keyof ApplicationFormData)[]);

        if (isStepValid) {
            setStepErrors(prev => ({ ...prev, [currentStep]: [] }));
            setCurrentStep(currentStep + 1);
            await saveProgress();
        } else {
            const currentErrors = getReactHookFormErrorMessages(errors);
            setStepErrors(prev => ({ ...prev, [currentStep]: currentErrors }));
        }
    };

    const handleReset = async () => {
        const defaultValues = getDefaultValues(programType);
        reset(defaultValues);
        setStepErrors({});
        setCurrentStep(0);
        await clearProgress();
        setTimeout(() => trigger(), 100);
    };

    const handleEditSection = (section: string) => {
        const baseMap = { ...STEP_TO_SECTION_MAP };
        baseMap.documents = programType === ProgramType.BUSINESS_SCHOOL ? 3 : 2;
        baseMap.terms = programType === ProgramType.BUSINESS_SCHOOL ? 5 : 3;

        const stepIndex = baseMap[section];
        if (stepIndex !== undefined && stepIndex < steps.length) {
            setCurrentStep(stepIndex);
        }
    };

    const onSubmit = (data: ApplicationFormData) => {
        if (typeof access_token === 'string' && access_token.trim() !== '') {
            submitApplicationMutation.mutate(data);
        } else {
            toast.error("Access token is missing or invalid");
        }
    };

    if (isSubmitted) {
        return <SuccessScreen onReset={handleReset} />;
    }

    const isReviewStep = steps[currentStep].title === 'Review & Submit';
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 mt-20">
            <Link href="/admission" className="absolute top-10 right-10 z-50 flex items-center gap-3 p-4 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors font-bold rounded-lg shadow-md">
                Admission Overview
            </Link>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-(--color-site-b-dark) mb-2">
                        {SITE_TITLE} {programType === ProgramType.BUSINESS_SCHOOL ? 'Business School' : 'ODL Program'} Admission
                    </h1>
                    <p className="text-lg text-(--color-site-a-dark)">
                        {programType === ProgramType.BUSINESS_SCHOOL
                            ? 'Take the next step in your business career'
                            : 'Start your academic journey with us'}
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="overflow-x-auto">
                        <div className="flex justify-between items-start md:items-center gap-4 mb-4 min-w-[600px] md:min-w-0">
                            {steps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center flex-shrink-0 w-20">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 md:mb-2 transition-all duration-300 ${index <= currentStep ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
                                        }`}>
                                        <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <span className={`text-[10px] text-center md:text-sm font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                                        }`}>
                                        {step.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
                    <StepErrorDisplay stepErrors={stepErrors} currentStep={currentStep} />
                </div>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                                    {steps[currentStep].title}
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    Step {currentStep + 1} of {steps.length} • {programType === ProgramType.BUSINESS_SCHOOL ? 'Business School' : 'Degree Program'}
                                </CardDescription>
                            </div>
                            <div className="flex flex-col xs:flex-row gap-3 sm:gap-5 justify-center sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    disabled={isSaving}
                                    className="flex items-center space-x-2 text-red-600 border-red-200 bg-red-100 hover:bg-red-50"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Clear Saved Data</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={saveProgress}
                                    disabled={isSaving}
                                    className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Save Progress</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div>
                            {/* Display all fields with errors */}
                            {fieldsWithErrors.length > 0 && (
                                <div className="text-red-600">
                                    <h4>Fields with errors:</h4>
                                    <ul>
                                        {fieldsWithErrors.map(fieldName => (
                                            <li key={fieldName}>
                                                {fieldName}: {errors[fieldName]?.message}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent>
                        <FormContent
                            isReviewStep={isReviewStep}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            stepTitle={steps[currentStep].title}
                            programType={programType}
                            form={form}
                            setILunched={setILunched}
                            handleEditSection={handleEditSection}
                            mutation={submitApplicationMutation}
                            isFirstStep={isFirstStep}
                            isLastStep={isLastStep}
                            isValid={isValid}
                            isSaving={isSaving}
                            saveProgress={saveProgress}
                            handleStepNavigation={handleStepNavigation}
                        />
                    </CardContent>
                </Card>

                <div className="text-center mt-8 text-gray-500">
                    <p>Need help? Contact our admissions team at support@university.edu</p>
                    <p className="text-sm mt-2">Your progress is automatically saved when you move between steps.</p>
                </div>
            </div>
            <TermsAndConditions lauched={lauched} setILunched={setILunched} />
        </div>
    );
};

interface FormContentProps {
    isReviewStep: boolean;
    handleSubmit: (onValid: SubmitHandler<ApplicationFormData>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    onSubmit: SubmitHandler<ApplicationFormData>;
    stepTitle: string;
    programType: ProgramType;
    form: UseFormReturn<ApplicationFormData>;
    setILunched: (launched: boolean) => void;
    handleEditSection: (section: string) => void;
    mutation: UseMutationResult<unknown, Error, ApplicationFormData, unknown>;
    isFirstStep: boolean;
    isLastStep: boolean;
    isValid: boolean;
    isSaving: boolean;
    saveProgress: () => Promise<void>;
    handleStepNavigation: (direction: 'next' | 'prev') => Promise<void>;
}

// ============= FORM CONTENT COMPONENT =============
const FormContent = ({
    isReviewStep,
    handleSubmit,
    onSubmit,
    stepTitle,
    programType,
    form,
    setILunched,
    handleEditSection,
    mutation,
    isFirstStep,
    isLastStep,
    isValid,
    isSaving,
    saveProgress,
    handleStepNavigation,
}: FormContentProps) => {
    const content = (
        <>
            {StepRenderer.render(stepTitle, programType, form, setILunched, handleEditSection)}

            {mutation.isError && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                        {getAPIFriendlyError(mutation.error)}
                    </AlertDescription>
                </Alert>
            )}

            <NavigationButtons
                isReviewStep={isReviewStep}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                isValid={isValid}
                isSaving={isSaving}
                isPending={mutation.isPending}
                onPrev={() => handleStepNavigation('prev')}
                onNext={() => handleStepNavigation('next')}
                onSave={saveProgress}
            />
        </>
    );
    console.log('isReviewStep', isReviewStep)
    return isLastStep ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {content}
        </form>
    ) : (
        <div className="space-y-6">{content}</div>
    );
};

interface NavigationButtonsProps {
    isReviewStep: boolean;
    isFirstStep: boolean;
    isLastStep: boolean;
    isValid: boolean;
    isSaving: boolean;
    isPending: boolean;
    onPrev: () => void;
    onNext: () => void;
    onSave: () => Promise<void>;
}


// ============= NAVIGATION BUTTONS COMPONENT =============
const NavigationButtons = ({
    isReviewStep,
    isFirstStep,
    isLastStep,
    isValid,
    isSaving,
    isPending,
    onPrev,
    onNext,
    onSave,
}: NavigationButtonsProps) => (
    <div className="flex justify-between pt-6">
        <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            disabled={isFirstStep}
            className="flex items-center space-x-2"
        >
            <span>Previous</span>
        </Button>

        <div className="flex space-x-3">
            {!isReviewStep && (
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                        </>
                    )}
                </Button>
            )}

            {isLastStep ? (
                <Button
                    type="submit"
                    disabled={!isValid || isPending}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 rounded-lg"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Submit Application</span>
                        </>
                    )}
                </Button>
            ) : (
                <Button
                    type="button"
                    onClick={onNext}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                    <span>Next</span>
                </Button>
            )}
        </div>
    </div>
);

export default AdmissionForm;
