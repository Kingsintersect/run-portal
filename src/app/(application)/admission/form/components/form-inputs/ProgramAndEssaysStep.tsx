"use client";

import Fade from "@/components/application/animatives/Fade";
import { FormField } from "@/components/forms/FormField";
import { STUDY_MODES } from "@/components/forms/applicationFormConstants";
import { TermsAndConditionsTrigger } from "./TermsAndConditionsContent";
import { ApplicationFormData } from "@/schemas/admission-schema";
import { UseFormReturn } from "react-hook-form";
import { FileUploader } from "@/components/forms/FileUploader";

interface ProgramAndEssaysStepProps {
    form: UseFormReturn<ApplicationFormData>;
    setILunched: (boolean) => void;
}
export const ProgramAndEssaysStep: React.FC<ProgramAndEssaysStepProps> = ({ form, setILunched }) => {
    const { control, watch, formState: { errors } } = form;
    const has_disability = watch("has_disability");

    return (
        <div className="space-y-7">
            <div className="w-full flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                {/* Document Upload */}
                <div className="w-full sm:w-1/2 space-y-4 sm:px-20">
                    <FileUploader
                        name="passport"
                        label="Passport photograph"
                        control={control}
                        // errors={errors}
                        accept="image/*"
                        maxSize={10}
                        multiple={false}
                    // showPreview={true}
                    />
                </div>

                {/* Current session info */}
                <div className="w-full sm:w-1/2 flex justify-start sm:justify-center items-center my-auto">
                    <div className="text-sm sm:text-base">
                        ( Current session - <span className="text-site-a-dark font-semibold">2025 / 2026</span> )
                    </div>
                </div>
            </div>


            <FormField
                name="studyMode"
                control={control}
                errors={errors}
                label="Study Mode (Online only available for now)"
                required
                type="radio"
                options={STUDY_MODES}
            />

            <FormField
                name="personalStatement"
                control={control}
                errors={errors}
                label="Personal Statement"
                required
                type="textarea"
                placeholder="Tell us about yourself, your background, and why you want to pursue this program..."
                rows={6}
            />

            <FormField
                name="careerGoals"
                control={control}
                errors={errors}
                label="Career Goals"
                required
                type="textarea"
                placeholder="Describe your short-term and long-term career goals..."
                rows={6}
            />

            <div className="space-y-4">
                <FormField
                    name="has_disability"
                    control={control}
                    errors={errors}
                    label="I have disabilities"
                    type="checkbox"
                />
                <Fade duration={200} in={has_disability}>
                    <FormField
                        name="disability"
                        control={control}
                        errors={errors}
                        label="Explain disability"
                        required
                        type="textarea"
                        placeholder="Describe the nature of your disability..."
                        rows={6}
                    />
                </Fade>
            </div>

            <div className="flex items-center gap-5">
                <FormField
                    name="agreeToTerms"
                    control={control}
                    errors={errors}
                    label="I agree to the terms and conditions *"
                    type="checkbox"
                />
                {/* <Link className="block text-sm text-blue-600 font-bold animate-bounce mt-2" href={"/admission/terms-and-conditions"}>Read the terms and conditions</Link> */}
                <TermsAndConditionsTrigger
                    className="text-sm text-blue-600 font-bold animate-bounce mt-2"
                    setILunched={setILunched}
                />
            </div>
        </div>
    );
}