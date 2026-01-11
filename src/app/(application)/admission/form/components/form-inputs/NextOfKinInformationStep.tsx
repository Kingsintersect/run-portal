
import { UseFormReturn } from "react-hook-form";
import Fade from "@/components/application/animatives/Fade";
import { FormField } from "@/components/forms/FormField";
import { ApplicationFormData } from "@/schemas/admission-schema";

interface NextOfKinInformationStepProps {
    form: UseFormReturn<ApplicationFormData>;
}
export const NextOfKinInformationStep: React.FC<NextOfKinInformationStepProps> = ({ form }) => {
    const { control, watch, formState: { errors } } = form;
    const has_sponsor = watch("has_sponsor");

    return (
        <div className="space-y-6">
            <h5 className=" h-5 text-red-400">Do you have a sponsor</h5>
            <FormField
                name="has_sponsor"
                control={control}
                errors={errors}
                label="Check this box if someone else is sponsoring you"
                required
                type="checkbox"
            />

            <hr className="my-16" />
            <Fade duration={200} in={has_sponsor} className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <FormField
                        name="sponsor_name"
                        control={control}
                        errors={errors}
                        label="Sponsor's Full Name"
                        placeholder="e.g. Ani Chukwu..."
                        required={has_sponsor}
                    />
                    <FormField
                        name="sponsor_relationship"
                        control={control}
                        errors={errors}
                        label="Relationship with Sponsor"
                        placeholder="e.g. Father, Mother, Guardian"
                        required={has_sponsor}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <FormField
                        name="sponsor_phone_number"
                        control={control}
                        errors={errors}
                        label="Sponsor's Phone Number"
                        placeholder="+234 8123456780"
                        required={has_sponsor}
                    />
                    <FormField
                        name="sponsor_email"
                        control={control}
                        errors={errors}
                        label="Sponsor's Email"
                        placeholder="e.g. sponsor@gmail.com"
                    />
                </div>

                <FormField
                    name="sponsor_contact_address"
                    control={control}
                    errors={errors}
                    label="Sponsor's Contact Address"
                    placeholder="e.g. 123 Sponsor St, City, State"
                    required={has_sponsor}
                />
            </Fade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                <FormField
                    name="next_of_kin_name"
                    control={control}
                    errors={errors}
                    label="Full Name of your Next-of-kin"
                    required
                    placeholder="e.g. Ani Kelvin..."
                />
                <FormField
                    name="next_of_kin_relationship"
                    control={control}
                    errors={errors}
                    label="Relationship with your Next-of-kin"
                    required
                    placeholder="e.g. Father, Mother, Guardian, son, Daughter, nephew, nice ... "
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    name="next_of_kin_address"
                    control={control}
                    errors={errors}
                    label="address of your Next-of-kin"
                    required
                    placeholder="e.g. 123 mykin's St, city, state, country... "
                />
                <div className="border border-gray-300 p-10 rounded-2xl space-y-5">
                    <FormField
                        name="next_of_kin_phone_number"
                        control={control}
                        errors={errors}
                        type="email"
                        required
                        label="Phone number of your Next-of-kin"
                        placeholder="e.g. 07012345678"
                    />
                    <FormField
                        name="is_next_of_kin_primary_contact"
                        control={control}
                        errors={errors}
                        label="Check this box if its primary contact"
                        type="checkbox"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    name="next_of_kin_email"
                    control={control}
                    errors={errors}
                    type="email"
                    label="Email address of your Next-of-kin"
                    placeholder="e.g. mykin@gmail.com"
                />
                <FormField
                    name="next_of_kin_alternate_phone_number"
                    control={control}
                    errors={errors}
                    label="Alternative phone number of your Next-of-kin"
                    placeholder="e.g. 09012345678 "
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    name="next_of_kin_occupation"
                    control={control}
                    errors={errors}
                    type="email"
                    label="Occupation of your Next-of-kin"
                    placeholder="e.g. Civil servant, trader, student..."
                />
                <FormField
                    name="next_of_kin_workplace"
                    control={control}
                    errors={errors}
                    label="Workplace of your Next-of-kin"
                    placeholder="e.g. 567 work St, city, state... "
                />
            </div>
        </div>
    );
}