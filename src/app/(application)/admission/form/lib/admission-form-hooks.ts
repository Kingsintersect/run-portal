'use client';

import { useEffect, useState } from "react";
import { FormDataTransformer, StorageManager } from "./utils";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { submitAdmissionForm } from "@/app/actions/admission-actions";
import { getAPIFriendlyError } from "@/lib/errorsHandler";
import { AuthUser } from "@/types/user";
import { ApplicationFormData, ODLApplication, applicationSchema, businessSchoolSchema, odlProgramSchema } from "@/schemas/admission-schema";
import { Briefcase, FileText, GraduationCap, FileStack, Users, User, CheckCircle } from "lucide-react";
import { Path } from "react-hook-form";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProgramType } from '@/config';

// ============= FORM CONFIGURATION =============
const FORM_CONFIG = {
    mode: 'onChange' as const,
    reValidateMode: 'onChange' as const,
    criteriaMode: 'all' as const,
};

/**
 * Dynamically creates a valid default object based on the program type.
 * It leverages Zod's `.parse({})` method to apply all default values
 * defined in the corresponding schema, ensuring a perfectly valid initial state.
 */
function createDefaultValues(programType: ProgramType): Partial<ApplicationFormData> {
    const schemaToUse = programType === ProgramType.ODL ? odlProgramSchema : businessSchoolSchema;
    const shape = schemaToUse.shape;
    const defaultValues: Record<string, unknown> = { programType };

    for (const key in shape) {
        if (key === 'programType') continue;
        if (programType === ProgramType.ODL && key === 'startTerm') {
            defaultValues[key] = '2025/2026';
            continue;
        }
        if (programType === ProgramType.ODL && key === 'studyMode') {
            defaultValues[key] = 'online';
            continue;
        }
        const fieldSchema = shape[key];
        // Check if the field has a default value defined in the schema
        if ('_def' in fieldSchema && 'defaultValue' in fieldSchema._def) {
            defaultValues[key] = fieldSchema._def.defaultValue();
        } else {
            // Provide a sensible fallback for fields without a .default()
            defaultValues[key] = undefined;
        }
    }

    return defaultValues as Partial<ApplicationFormData>;
}

// ============= CUSTOM HOOK =============
export const useApplicationForm = (programType: ProgramType) => {
    const [steps, setSteps] = useState(() => getSteps(programType));
    const defaultValues = createDefaultValues(programType);

    const form = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
        defaultValues,
        ...FORM_CONFIG,
    });

    // Synchronize steps when program type changes
    useEffect(() => {
        setSteps(getSteps(programType));
    }, [programType]);

    return {
        ...form,
        steps,
        programType,
        getDefaultValues: (type: ProgramType) => createDefaultValues(type),
    };
};

// ============= EXPORTED UTILITY =============
export const getDefaultValues = (programType: ProgramType) =>
    createDefaultValues(programType);


// ============= CUSTOM HOOKS =============
export const useFormPersistence = (
    reset: (data) => void,
    getValues: () => ApplicationFormData,
    steps: Step[],
    currentStep: number,
    programType: ProgramType
) => {
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data, step } = await StorageManager.loadProgress(steps);
                if (data) {
                    reset(data);
                    toast.success("Previous progress loaded successfully!");
                }
                return step;
            } catch (error) {
                console.error("Failed to load saved progress:", error);
                toast.error("Failed to load saved progress");
                return 0;
            }
        };
        loadData();
    }, [reset, steps, steps.length]);

    const saveProgress = async () => {
        setIsSaving(true);
        try {
            const formData = getValues();
            await StorageManager.saveProgress(currentStep, programType, formData);
            toast.success("Progress saved successfully!");
        } catch (error) {
            console.error("Failed to save progress:", error);
            toast.error("Failed to save progress");
        } finally {
            setIsSaving(false);
        }
    };

    const clearProgress = async () => {
        try {
            await StorageManager.clearProgress();
            toast.success("Saved progress cleared.");
        } catch (error) {
            console.error("Failed to clear saved progress:", error);
            toast.error("Failed to clear form data");
        }
    };

    return { isSaving, saveProgress, clearProgress };
};

export const useFormSubmission = (
    access_token: string | undefined,
    programType: ProgramType,
    user: AuthUser | null,
    updateUserInState: (data) => void,
    refreshUserData: () => Promise<void>,
    clearProgress: () => Promise<void>,
    onSubmitSuccess?: () => void,
) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const submitApplicationMutation = useMutation({
        retry: false, // Disable retries for form submission
        mutationFn: async (data: ApplicationFormData) => {
            if (!access_token || typeof access_token !== 'string') {
                throw new Error("Missing access token");
            }
            const transformedData = FormDataTransformer.transform(data, programType);
            return submitAdmissionForm(transformedData, access_token);
        },
        onSuccess: async () => {
            setIsSubmitted(true);
            if (user) {
                updateUserInState({ ...user, is_applied: Number(true) });
            }
            refreshUserData();
            // await clearProgress();
            toast.success("Application submitted successfully!");
            onSubmitSuccess?.();
        },
        onError: (error) => {
            console.error("Submission error:", error);
            toast.error(getAPIFriendlyError(error));
        },
    });

    return { isSubmitted, submitApplicationMutation }
};


// Enhanced STEPS configuration with program awareness
export interface Step {
    title: string;
    icon: React.ElementType;
    fields?: Path<ApplicationFormData>[];
    getFields?: (values: ApplicationFormData) => Path<ApplicationFormData>[];
    programs?: ProgramType[];
    // programs?: ('business_school' | 'odl')[];
}

export const getSteps = (programType: ProgramType): Step[] => {
    const commonSteps: Step[] = [
        {
            title: 'Personal Information',
            icon: User,
            fields: ['lga', 'religion', 'dob', 'gender', 'hometown', 'hometown_address', 'contact_address']
        },
        {
            title: 'Next of Kin',
            icon: Users,
            getFields: (values) => {
                const baseFields: Path<ApplicationFormData>[] = [
                    'has_sponsor',
                    'next_of_kin_name',
                    'next_of_kin_relationship',
                    'next_of_kin_phone_number',
                    'next_of_kin_address',
                    'is_next_of_kin_primary_contact',
                    'next_of_kin_occupation',
                    'next_of_kin_workplace',
                ];

                const sponsorFields: Path<ApplicationFormData>[] = [
                    'sponsor_name',
                    'sponsor_relationship',
                    'sponsor_email',
                    'sponsor_contact_address',
                    'sponsor_phone_number',
                ];

                return values.has_sponsor ? [...baseFields, ...sponsorFields] : baseFields;
            }
        },
    ];

    const businessSteps: Step[] = [
        {
            title: 'Academic Background',
            icon: GraduationCap,
            fields: ['undergraduateDegree', 'university', 'graduationYear', 'gpa'],
            programs: [ProgramType.BUSINESS_SCHOOL]
        },
        {
            title: 'Academic Credentials',
            icon: FileStack,
            fields: ['first_school_leaving', 'o_level', 'hnd', 'degree', 'degree_transcript', 'other_documents'],
            programs: [ProgramType.BUSINESS_SCHOOL]
        },
        {
            title: 'Professional Experience',
            icon: Briefcase,
            fields: ['workExperience', 'currentPosition', 'company', 'yearsOfExperience'],
            programs: [ProgramType.BUSINESS_SCHOOL]
        },
        {
            title: 'Program & Essays',
            icon: FileText,
            fields: ['personalStatement', 'careerGoals', 'agreeToTerms'],
            programs: [ProgramType.BUSINESS_SCHOOL]
        },
    ];

    const degreeSteps: Step[] = [
        {
            title: 'Academic Information',
            icon: GraduationCap,
            getFields: (values: ApplicationFormData) => {
                const baseFields: Path<ApplicationFormData>[] = [
                    'awaiting_result',
                    // 'first_school_leaving'
                ];

                // Check if this is an ODL application
                if (values.programType === ProgramType.ODL) {
                    const odlValues = values as ODLApplication;

                    if (!odlValues.awaiting_result) {
                        baseFields.push('combined_result' as Path<ApplicationFormData>);
                        baseFields.push('first_sitting_type' as Path<ApplicationFormData>);
                        baseFields.push('first_sitting_year' as Path<ApplicationFormData>);
                        baseFields.push('first_sitting_exam_number' as Path<ApplicationFormData>);

                        if (odlValues.combined_result === 'combined_result') {
                            baseFields.push('second_sitting_type' as Path<ApplicationFormData>);
                            baseFields.push('second_sitting_year' as Path<ApplicationFormData>);
                            baseFields.push('second_sitting_exam_number' as Path<ApplicationFormData>);
                        }

                        baseFields.push('other_documents' as Path<ApplicationFormData>);
                    }
                }

                return baseFields;
            },
            programs: [ProgramType.ODL]
        },
        {
            title: 'Passport & Summary',
            icon: FileText,
            getFields: (values) => {
                const baseFields: Path<ApplicationFormData>[] = ['passport', 'agreeToTerms'];

                if (values.has_disability) {
                    baseFields.push('disability');
                }

                return baseFields;
            },
            programs: [ProgramType.ODL]
        },
    ];

    const finalStep: Step[] = [
        {
            title: 'Review & Submit',
            icon: CheckCircle,
            fields: ['agreeToTerms'],
            programs: [ProgramType.BUSINESS_SCHOOL, ProgramType.ODL]
        }
    ];

    if (programType === ProgramType.BUSINESS_SCHOOL) {
        return [...commonSteps, ...businessSteps, ...finalStep];
    } else {
        return [...commonSteps, ...degreeSteps, ...finalStep];
    }
};
