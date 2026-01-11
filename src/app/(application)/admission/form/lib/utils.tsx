
import { ProgramType } from "@/config";
import { formStorage } from "@/lib/storage";
import { ApplicationFormData, businessSchoolSchema, odlProgramSchema } from "@/schemas/admission-schema";
import { JSX } from "react";
import { Control, UseFormReturn, useWatch } from "react-hook-form";
import { PersonalInformationStep } from "../components/form-inputs/PersonalInformationStep";
import { NextOfKinInformationStep } from "../components/form-inputs/NextOfKinInformationStep";
import { AcademicBackgroundStep } from "../components/form-inputs/AcademicBackgroundStep";
import { AcademicCredentialsStep } from "../components/form-inputs/AcademicCredentialsStep";
import { ProfessionalExperienceStep } from "../components/form-inputs/ProfessionalExperienceStep";
import { ProgramAndEssaysStep } from "../components/form-inputs/ProgramAndEssaysStep";
import { AcademinInfoStep } from "../components/form-inputs/odl-forms/AcademinInfoStep";
import { PassportSumary } from "../components/form-inputs/odl-forms/PassportSumary";
import { ReviewStep } from "../components/ReviewStep";
import { Step } from "./admission-form-hooks";

// ============= CONSTANTS =============
const STORAGE_KEYS = {
    FORM_DATA: 'admission_form_progress',
    CURRENT_STEP: 'admission_form_current_step',
    PROGRAM_TYPE: 'admission_form_program_type',
} as const;

export const STEP_TO_SECTION_MAP: Record<string, number> = {
    personal: 0,
    nextOfKin: 1,
    sponsor: 1,
    business: 2,
    degree: 2,
};

// ============= UTILITY FUNCTIONS =============
export const StorageManager = {
    async loadProgress(steps: Step[]) {
        const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
        const savedData = await formStorage.loadFormData(STORAGE_KEYS.FORM_DATA);

        const stepNumber = savedStep ? parseInt(savedStep) : null;
        const isValidStep = stepNumber !== null && stepNumber >= 0 && stepNumber < steps.length;

        return {
            data: savedData,
            step: isValidStep ? stepNumber : 0,
        };
    },

    async saveProgress(currentStep: number, programType: ProgramType, formData: ApplicationFormData) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep.toString());
        localStorage.setItem(STORAGE_KEYS.PROGRAM_TYPE, programType);
        await formStorage.saveFormData(STORAGE_KEYS.FORM_DATA, formData);
    },

    async clearProgress() {
        await formStorage.clearFormData(STORAGE_KEYS.FORM_DATA);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
        localStorage.removeItem(STORAGE_KEYS.PROGRAM_TYPE);
    },
};

// In your utils.ts, replace FormDataTransformer:
export const FormDataTransformer = {
    transform(data: ApplicationFormData, programType: ProgramType): ApplicationFormData {
        // Determine the correct schema based on the programType
        const schemaToUse = programType === ProgramType.ODL ? odlProgramSchema : businessSchoolSchema;

        // Get the set of valid keys from the schema's shape
        const validKeys = new Set(Object.keys(schemaToUse.shape));

        // Filter the input data to include only the valid keys
        const transformedData = Object.fromEntries(
            Object.entries(data).filter(([key]) => validKeys.has(key))
        );

        return transformedData as ApplicationFormData;
    },
};

export const StepRenderer = {
    render(
        stepTitle: string,
        programType: ProgramType,
        form: UseFormReturn<ApplicationFormData>,
        setILunched: (value: boolean) => void,
        onEdit?: (section: string) => void
    ) {
        const commonSteps: Record<string, JSX.Element> = {
            'Personal Information': <PersonalInformationStep form={form} />,
            'Next of Kin': <NextOfKinInformationStep form={form} />,
        };

        const businessSteps: Record<string, JSX.Element> = {
            'Academic Background': <AcademicBackgroundStep form={form} />,
            'Academic Credentials': <AcademicCredentialsStep form={form} />,
            'Professional Experience': <ProfessionalExperienceStep form={form} />,
            'Program & Essays': <ProgramAndEssaysStep form={form} setILunched={setILunched} />,
        };

        const odlSteps: Record<string, JSX.Element> = {
            'Academic Information': <AcademinInfoStep form={form} />,
            'Passport & Summary': <PassportSumary form={form} setILunched={setILunched} />,
        };

        if (commonSteps[stepTitle]) return commonSteps[stepTitle];

        if (programType === ProgramType.BUSINESS_SCHOOL && businessSteps[stepTitle]) {
            return businessSteps[stepTitle];
        }

        if (programType === ProgramType.ODL && odlSteps[stepTitle]) {
            return odlSteps[stepTitle];
        }

        if (stepTitle === 'Review & Submit') {
            return <ReviewStep form={form} programType={programType} onEdit={onEdit} />;
        }

        return null;
    },
};


// Add this component outside AdmissionForm
export const DebugInfo = ({ control }: { control: Control<ApplicationFormData> }) => {
    const allValues = useWatch({ control });

    return (
        <div style={{ background: '#ffcccc', padding: '1rem', margin: '1rem 0', fontSize: '10px' }}>
            <h4>DEBUG - All Registered Fields:</h4>
            <div>Total fields: {Object.keys(allValues).length}</div>
            <div>Business fields present: {
                ['undergraduateDegree', 'personalStatement'].filter(field =>
                    field in allValues && allValues[field] !== undefined
                ).length
            }</div>
            <div>ODL fields present: {
                ['combined_result', 'first_sitting_type'].filter(field =>
                    field in allValues && allValues[field] !== undefined
                ).length
            }</div>
            {/* <div>All fields:
                <pre>
                    {JSON.stringify(Object.keys(allValues).sort())}
                </pre>
            </div> */}
        </div>
    );
};