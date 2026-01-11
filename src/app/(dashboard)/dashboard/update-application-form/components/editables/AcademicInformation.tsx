"use client";

import { Edit3, GraduationCap, Save, X } from 'lucide-react';
import { EditableField } from '@/components/forms/EditableFormFields';
import { useEditableSection } from '@/hooks/useEditableSection';
import { ApplicationFormData, BusinessApplication } from '@/schemas/admission-schema';

export interface AcademicInformationProps {
    application: Partial<ApplicationFormData & Partial<BusinessApplication>>;
}

export default function AcademicInformation({ application }: AcademicInformationProps) {
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
        applicationId: (application.id || '').toString(),
        initialData: {
            undergraduateDegree: application.undergraduateDegree || '',
            university: application.university || '',
            graduationYear: application.graduationYear || '',
            gpa: application.gpa || '',
            gmatScore: String(application.gmatScore) || '',
            greScore: application.greScore || '',
        },
        updateType: 'application',
    });

    const canSave = () => {
        if (!hasChanges) return false;
        if (!formData.undergraduateDegree || !formData.university) return false;
        return true;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <GraduationCap className="w-6 h-6 mr-2 text-blue-600" />
                    Academic Background
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

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                    label="Undergraduate Degree"
                    type="text"
                    value={formData.undergraduateDegree}
                    onChange={(value) => updateField('undergraduateDegree', value)}
                    placeholder="e.g. Bachelor of Science in..."
                    isEditing={isEditing}
                />

                <EditableField
                    label="University"
                    type="text"
                    value={formData.university}
                    onChange={(value) => updateField('university', value)}
                    placeholder="Enter university name"
                    isEditing={isEditing}
                />

                <EditableField
                    label="GPA"
                    type="text"
                    value={formData.gpa}
                    onChange={(value) => updateField('gpa', value)}
                    placeholder="e.g. 3.8"
                    isEditing={isEditing}
                />

                <EditableField
                    label="Graduation Year"
                    type="text"
                    value={formData.graduationYear}
                    onChange={(value) => updateField('graduationYear', value)}
                    placeholder="e.g. 2020"
                    isEditing={isEditing}
                />

                <EditableField
                    label="GMAT Score"
                    type="text"
                    value={formData.gmatScore}
                    onChange={(value) => updateField('gmatScore', value)}
                    placeholder="Enter GMAT score (optional)"
                    isEditing={isEditing}
                />

                <EditableField
                    label="GRE Score"
                    type="text"
                    value={formData.greScore || ''}
                    onChange={(value) => updateField('greScore', value)}
                    placeholder="Enter GRE score (optional)"
                    isEditing={isEditing}
                />
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
