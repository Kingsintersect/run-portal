"use client";

import { Award, Edit3, Save, X } from 'lucide-react';
import React from 'react'
import { STUDY_MODES } from '@/components/forms/applicationFormConstants';
import { useExternalPrograms } from '@/hooks/useExternalPrograms'; // Your programs hook
import { EditableProgramOptions, EditableRadioGroup } from '@/components/forms/EditableFormFields';
import { useEditableSection } from '@/hooks/useEditableSection';
import { ApplicationDetailsType } from '@/schemas/admission-schema';
import { ProgramType, SelectedProgramType } from '@/config';

export interface ProgramInfoProps {
    application: ApplicationDetailsType;
}

export default function ProgramInfo({
    application,
}: ProgramInfoProps) {
    // // Load programs data
    const { data: programs, isLoading, isError } = useExternalPrograms();

    const {
        isEditing,
        formData,
        isSaving,
        hasChanges,
        handleEdit,
        handleCancel,
        handleSave,
        updateField,
    } = useEditableSection({
        applicationId: (application.application.id || '').toString(),
        initialData: {
            // Access the nested application property
            program: application.application.programType === ProgramType.BUSINESS_SCHOOL
                ? (application.program ?? '')
                : (application.program ?? ''),
            program_id: application.program_id ?? '',
            studyMode: application.application.studyMode ?? '',
            academic_session: application.academic_session ?? '',
            email: application.email,
            phone_number: application.phone_number,
        },
        updateType: 'application',
    });

    // Validation
    const canSave = () => {
        if (!hasChanges) return false;
        if (!formData.email || !formData.phone_number) return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return false;

        return true;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header with Edit/Save buttons */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Award className="w-10 h-10 mr-2 text-blue-600" />
                    Program of choice
                </h3>

                <div className="flex items-center space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !canSave()}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-3 h-3 mr-1.5" />
                                        Save
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="inline-flex items-center px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                            >
                                <X className="w-3 h-3 mr-1.5" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Edit3 className="w-3 h-3 mr-1.5" />
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 gap-4">
                <EditableProgramOptions
                    label="Selected Programme"
                    value={formData.program}
                    onChange={(value) => updateField('program', value)}
                    onIdChange={(id) => updateField('program_id', id)}
                    isEditing={isEditing}
                    programs={programs}
                    isLoading={isLoading}
                    isError={isError}
                    showRequirementLink={SelectedProgramType === ProgramType.BUSINESS_SCHOOL}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EditableRadioGroup
                        label="Study Mode"
                        value={formData.studyMode}
                        onChange={(value) => updateField('studyMode', value)}
                        options={STUDY_MODES}
                        isEditing={isEditing}
                    />

                    {/* <EditableSelect
                        label="Academic Session"
                        value={String(formData.academic_session)}
                        onChange={(value) => updateField('academic_session', value)}
                        options={ACADEMIC_SESSION}
                        isEditing={isEditing}
                    /> */}
                </div>
            </div>

            {/* Unsaved changes warning */}
            {isEditing && hasChanges && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        You have unsaved changes. Make sure to save before leaving this section.
                    </p>
                </div>
            )}
        </div>
    );
} 