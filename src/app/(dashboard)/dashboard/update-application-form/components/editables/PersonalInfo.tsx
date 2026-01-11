"use client";

import { Edit3, Save, User, X } from 'lucide-react';
import { RELIGION } from '@/components/forms/applicationFormConstants';
import { EditableField, EditableSelect, EditableTextArea } from '@/components/forms/EditableFormFields';
import { useEditableSection } from '@/hooks/useEditableSection';
import { ApplicationDetailsType } from '@/schemas/admission-schema';

export interface EditablePersonalInfoProps {
    application: ApplicationDetailsType;
}

export default function PersonalInfo({ application }: EditablePersonalInfoProps) {
    // Editable section hook
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
            dob: application.application.dob || '',
            religion: application.application.religion || '',
            hometown: application.application.hometown || '',
            lga: application.application.lga || '',
            hometown_address: application.application.hometown_address || '',
            contact_address: application.application.contact_address || '',
            email: application.email || '',
            phone_number: application.phone_number || '',
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="w-6 h-6 mr-2 text-green-600" />
                    Personal Information
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

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                    label="Date of Birth"
                    type="date"
                    value={formData.dob}
                    onChange={(value) => updateField('dob', value)}
                    isEditing={isEditing}
                />

                <EditableSelect
                    label="Religion"
                    value={formData.religion}
                    onChange={(value) => updateField('religion', value)}
                    options={RELIGION}
                    placeholder="Identify your religion"
                    isEditing={isEditing}
                />

                <EditableField
                    label="Home Town"
                    value={formData.hometown}
                    onChange={(value) => updateField('hometown', value)}
                    placeholder="Specify your hometown"
                    isEditing={isEditing}
                />

                <EditableField
                    label="LGA"
                    value={formData.lga}
                    onChange={(value) => updateField('lga', value)}
                    placeholder="Local Government Area"
                    isEditing={isEditing}
                />

                <EditableField
                    label="Home Address"
                    value={formData.hometown_address || ''}
                    onChange={(value) => updateField('hometown_address', value)}
                    placeholder="Enter home address"
                    isEditing={isEditing}
                />

                <EditableTextArea
                    label="Contact Address"
                    value={formData.contact_address}
                    onChange={(value) => updateField('contact_address', value)}
                    placeholder="Enter contact address"
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
