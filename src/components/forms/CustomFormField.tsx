"use client";

import React from 'react';
import { Controller, FieldErrors } from 'react-hook-form';
import {
    CustomFormItem,
    CustomFormLabel,
    CustomFormControl,
    CustomFormDescription,
    CustomFormMessage
} from './CustomFormComponents';

interface CustomFormFieldProps {
    name: string;
    label: string;
    control: any;
    errors: FieldErrors<any>;
    className?: string;
    description?: string;
    children: (field: any) => React.ReactNode;
}

export const CustomFormField: React.FC<CustomFormFieldProps> = ({
    name,
    label,
    control,
    errors,
    className,
    description,
    children
}) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <CustomFormItem className={className}>
                    <CustomFormLabel>{label}</CustomFormLabel>
                    <CustomFormControl>
                        {children(field)}
                    </CustomFormControl>
                    {description && (
                        <CustomFormDescription>
                            {description}
                        </CustomFormDescription>
                    )}
                    <CustomFormMessage>
                        {errors[name]?.message as string}
                    </CustomFormMessage>
                </CustomFormItem>
            )}
        />
    );
};