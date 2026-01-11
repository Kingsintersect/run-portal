"use client";

import { BriefcaseBusiness, Edit3, Save, X } from 'lucide-react';
import React from 'react'
import { EditableField, EditableSelect } from '@/components/forms/EditableFormFields';
import { YEARS_OF_EXPERIENCE } from '@/components/forms/applicationFormConstants';
import { ApplicationDetailsType } from '@/schemas/admission-schema';
import { useEditableSection } from '@/hooks/useEditableSection';
import { useAppContext } from '@/contexts/AppContext';

export interface WorkExperienceInfoProps {
    application: ApplicationDetailsType;
}

type WorkExperienceData = {
    workExperience?: string;
    currentPosition?: string;
    company?: string;
    yearsOfExperience?: string;
};

export default function WorkExperienceInfo({
    application,
}: WorkExperienceInfoProps) {
    const { state } = useAppContext();

    const buildInitialData = (): WorkExperienceData => {
        const baseData: WorkExperienceData = {
            workExperience: undefined,
        };

        // Only add business school specific fields if isUBS is true
        if (state.isUBS) {
            // Use type assertion for business school specific fields
            const app = application.application as WorkExperienceData;
            return {
                ...baseData,
                workExperience: app.workExperience || undefined,
                currentPosition: app.currentPosition || undefined,
                company: app.company || undefined,
                yearsOfExperience: app.yearsOfExperience || undefined,
            };
        }

        return baseData;
    };
    const {
        isEditing,
        formData,
        isSaving,
        hasChanges,
        handleEdit,
        handleCancel,
        handleSave,
        updateField,
    } = useEditableSection<WorkExperienceData>({
        applicationId: (application.application.id || '').toString(),
        initialData: buildInitialData(),
        updateType: 'application',
    });

    // Validation - work experience fields are optional for business school
    const canSave = () => {
        if (!hasChanges) return false;
        // All fields are optional, so we can save as long as there are changes
        return true;
    };

    // Don't render for ODL applications
    if (!state.isUBS) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header with Edit/Save buttons */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BriefcaseBusiness className="w-10 h-10 mr-2 text-yellow-500" />
                    Work Experience
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                    label="Work Experience"
                    type="text"
                    value={formData.workExperience || ''}
                    onChange={(value) => updateField('workExperience', value)}
                    placeholder="Describe your work experience (optional)"
                    isEditing={isEditing}
                />

                <EditableField
                    label="Current Position"
                    type="text"
                    value={formData.currentPosition || ''}
                    onChange={(value) => updateField('currentPosition', value)}
                    placeholder="e.g. Senior Manager, Software Engineer (optional)"
                    isEditing={isEditing}
                />

                <EditableField
                    label="Company"
                    type='text'
                    value={formData.company || ''}
                    onChange={(value) => updateField('company', value)}
                    placeholder="Company name (optional)"
                    isEditing={isEditing}
                />

                <EditableSelect
                    label="Years Of Experience"
                    value={formData.yearsOfExperience || ''}
                    onChange={(value) => updateField('yearsOfExperience', value)}
                    options={YEARS_OF_EXPERIENCE}
                    placeholder="Select your years of experience (optional)"
                    isEditing={isEditing}
                />
            </div>

            {isEditing && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> All work experience fields are optional. Fill them out if you have relevant professional experience.
                    </p>
                </div>
            )}

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

