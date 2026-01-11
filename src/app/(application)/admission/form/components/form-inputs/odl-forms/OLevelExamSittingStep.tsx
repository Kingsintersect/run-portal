import { ApplicationFormData } from '@/schemas/admission-schema';
import React, { FC } from 'react'
import { UseFormReturn } from 'react-hook-form';

interface OLevelExamSittingStepProps {
    form: UseFormReturn<ApplicationFormData>;
}

const OLevelExamSittingStep: FC<OLevelExamSittingStepProps> = ({ form }) => {
    return (
        <div>OLevelExamSittingStep</div>
    )
}

export default OLevelExamSittingStep