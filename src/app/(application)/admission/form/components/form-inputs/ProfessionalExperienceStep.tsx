import { YEARS_OF_EXPERIENCE } from "@/components/forms/applicationFormConstants";
import { FormField } from "@/components/forms/FormField";
import { ApplicationFormData } from "@/schemas/admission-schema";
import { UseFormReturn } from "react-hook-form";

interface ProfessionalExperienceStepProps {
    form: UseFormReturn<ApplicationFormData>;
}
export const ProfessionalExperienceStep: React.FC<ProfessionalExperienceStepProps> = ({ form }) => {
    const { control, formState: { errors } } = form;

    return (
        <div className="space-y-6">
            <FormField
                name="workExperience"
                control={control}
                errors={errors}
                label="Work Experience"
                type="textarea"
                placeholder="Describe your work experience..."
                rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    name="currentPosition"
                    control={control}
                    errors={errors}
                    label="Current Position"
                    placeholder="Senior Marketing Manager"
                />
                <FormField
                    name="company"
                    control={control}
                    errors={errors}
                    label="Company"
                    placeholder="Microsoft Corporation"
                />
            </div>

            <FormField
                name="yearsOfExperience"
                control={control}
                errors={errors}
                label="Years of Experience"
                type="select"
                placeholder="Select years of experience"
                options={YEARS_OF_EXPERIENCE}
            />
        </div>
    );
}