"use client";

import { Edit3, NotebookPen, Save, X } from 'lucide-react';
import React from 'react'
import { EditableTextArea } from '@/components/forms/EditableFormFields';
import { useEditableSection } from '@/hooks/useEditableSection';
import { ApplicationDetailsType } from '@/schemas/admission-schema';
import { useAppContext } from '@/contexts/AppContext';

export interface CareerGoalsInfoProps {
    application: ApplicationDetailsType;
}

type CareerGoalsData = {
    careerGoals: string;
};

export default function CareerGoalsInfo({
    application,
}: CareerGoalsInfoProps) {
    const { state } = useAppContext();

    const buildInitialData = (): CareerGoalsData => {
        const baseData: CareerGoalsData = {
            careerGoals: "",
        };
        if (state.isUBS) {
            const app = application.application as CareerGoalsData;
            return {
                careerGoals: app.careerGoals || '',
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
    } = useEditableSection<CareerGoalsData>({
        applicationId: (application.application.id || '').toString(),
        initialData: buildInitialData(),
        updateType: 'application',
    });

    const canSave = () => {
        if (!hasChanges) return false;
        if (!formData.careerGoals || formData.careerGoals.trim().length < 100) return false;
        return true;
    };

    // Don't render this component for ODL applications
    if (!state.isUBS) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header with Edit/Save buttons */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <NotebookPen className="w-10 h-10 mr-2 text-teal-600" />
                    Career Goals
                </h3>

                <div className="flex items-center space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !canSave()}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
                <EditableTextArea
                    label="Career Goals"
                    value={formData.careerGoals}
                    onChange={(value) => updateField('careerGoals', value)}
                    placeholder="Describe your career goals (minimum 100 characters)..."
                    isEditing={isEditing}
                    className='col-span-2'
                    rows={8}
                />
                {isEditing && (
                    <p className="text-sm text-gray-500">
                        {formData.careerGoals.length}/250 characters
                        {formData.careerGoals.length < 100 &&
                            <span className="text-red-500 ml-2">
                                (minimum 100 characters required)
                            </span>
                        }
                    </p>
                )}
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

