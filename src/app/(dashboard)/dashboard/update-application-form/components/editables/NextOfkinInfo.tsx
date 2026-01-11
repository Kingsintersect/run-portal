"use client";

import { Edit3, ContactRound, Save, X } from 'lucide-react';
import React from 'react'
import { EditableField } from '@/components/forms/EditableFormFields';
import { ApplicationDetailsType } from '@/schemas/admission-schema';
import { useEditableSection } from '@/hooks/useEditableSection';

export interface NextOfkinInfoProps {
    application: ApplicationDetailsType;
}
export default function NextOfkinInfo({
    application,
}: NextOfkinInfoProps) {
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
            next_of_kin_name: application.application.next_of_kin_name || '',
            next_of_kin_email: application.application.next_of_kin_email || '',
            next_of_kin_phone_number: application.application.next_of_kin_phone_number || '',
            next_of_kin_relationship: application.application.next_of_kin_relationship || '',
            next_of_kin_address: application.application.next_of_kin_address || '',
            next_of_kin_occupation: application.application.next_of_kin_occupation || '',
            next_of_kin_workplace: application.application.next_of_kin_workplace || '',
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
                    <ContactRound className="w-10 h-10 mr-2 text-emerald-600" />
                    Next Of Kin Details
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
                    label="Full Name"
                    type="text"
                    value={formData.next_of_kin_name}
                    onChange={(value) => updateField('next_of_kin_name', value)}
                    placeholder="name of your next of kin"
                    isEditing={isEditing}
                />

                <EditableField
                    label="Email"
                    type="text"
                    value={String(formData.next_of_kin_email)}
                    onChange={(value) => updateField('next_of_kin_email', value)}
                    placeholder="Email address of nexr of kin"
                    isEditing={isEditing}
                />

                <EditableField
                    label="Phone Number"
                    type="text"
                    value={formData.next_of_kin_phone_number}
                    onChange={(value) => updateField('next_of_kin_phone_number', value)}
                    placeholder='Phone number of next of kin'
                    isEditing={isEditing}
                />

                <EditableField
                    label="Relationship"
                    type='text'
                    value={formData.next_of_kin_relationship}
                    onChange={(value) => updateField('next_of_kin_relationship', value)}
                    placeholder="e.g Father, Mother, Brother, Sister..."
                    isEditing={isEditing}
                />

                <EditableField
                    label="Address"
                    type='text'
                    value={formData.next_of_kin_address ?? ""}
                    onChange={(value) => updateField('next_of_kin_address', value)}
                    placeholder="Address of next of kin"
                    isEditing={isEditing}
                />

                <EditableField
                    label="Occupation"
                    type="text"
                    value={formData.next_of_kin_occupation || ''}
                    onChange={(value) => updateField('next_of_kin_occupation', value)}
                    placeholder="Occupation of next of kin"
                    isEditing={isEditing}
                />
                <EditableField
                    label="Workplace"
                    type="text"
                    value={formData.next_of_kin_workplace || ''}
                    onChange={(value) => updateField('next_of_kin_workplace', value)}
                    placeholder="Workplace of next of kin"
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