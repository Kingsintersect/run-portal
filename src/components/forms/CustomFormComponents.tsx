"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface CustomFormItemProps {
    children: React.ReactNode;
    className?: string;
}

export const CustomFormItem: React.FC<CustomFormItemProps> = ({ children, className }) => {
    return (
        <div className={cn("space-y-4", className)}>
            {children}
        </div>
    );
};

interface CustomFormLabelProps {
    children: React.ReactNode;
    htmlFor?: string;
}

export const CustomFormLabel: React.FC<CustomFormLabelProps> = ({ children, htmlFor }) => {
    return (
        <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {children}
        </label>
    );
};

interface CustomFormControlProps {
    children: React.ReactNode;
}

export const CustomFormControl: React.FC<CustomFormControlProps> = ({ children }) => {
    return <>{children}</>;
};

interface CustomFormDescriptionProps {
    children: React.ReactNode;
}

export const CustomFormDescription: React.FC<CustomFormDescriptionProps> = ({ children }) => {
    return (
        <p className="text-sm text-muted-foreground">
            {children}
        </p>
    );
};

interface CustomFormMessageProps {
    children?: React.ReactNode;
}

export const CustomFormMessage: React.FC<CustomFormMessageProps> = ({ children }) => {
    if (!children) return null;

    return (
        <p className="text-sm font-medium text-destructive">
            {children}
        </p>
    );
};