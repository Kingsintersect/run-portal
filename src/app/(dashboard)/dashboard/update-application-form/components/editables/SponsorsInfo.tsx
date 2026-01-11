"use client";

import { Edit3, UsersRound, Save, X, AlertCircle } from 'lucide-react';
import React from 'react'
import { EditableCheckbox, EditableField } from '@/components/forms/EditableFormFields';
import { useEditableSection } from '@/hooks/useEditableSection';
import { ApplicationDetailsType } from '@/schemas/admission-schema';

export interface SponsorInfoProps {
    application: ApplicationDetailsType;
}
export default function SponsorsInfo({
    application,
}: SponsorInfoProps) {
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
            has_sponsor: application.application.has_sponsor ?? false,
            sponsor_name: application.application.sponsor_name || '',
            sponsor_email: application.application.sponsor_email || '',
            sponsor_phone_number: application.application.sponsor_phone_number || '',
            sponsor_relationship: application.application.sponsor_relationship || '',
            sponsor_contact_address: application.application.sponsor_contact_address || '',
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
    const enableEditing = () => {
        // formData.has_sponsor = true;
        handleEdit();
    };
    const CancelEditing = () => {
        // formData.has_sponsor = false;
        handleCancel();
    };
    const clearFields = () => {
        formData.sponsor_name = '';
        formData.sponsor_email = '';
        formData.sponsor_phone_number = '';
        formData.sponsor_relationship = '';
        formData.sponsor_contact_address = '';
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header with Edit/Save buttons */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <UsersRound className="w-10 h-10 mr-2 text-rose-600" />
                    Sponsor's Details
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
                                onClick={CancelEditing}
                                disabled={isSaving}
                                className="inline-flex items-center px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                            >
                                <X className="w-3 h-3 mr-1.5" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={enableEditing}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Edit3 className="w-3 h-3 mr-1.5" />
                            Edit
                        </button>
                    )}
                </div>
            </div>

            <div className="w-full">

            </div>
            {/* Editable Fields */}
            {(!formData.has_sponsor && !isEditing)
                ? (<div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-green-600 mr-2" />
                        <p className="text-sm text-green-800">Self Sponsored</p>
                    </div>
                </div>)
                : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EditableCheckbox
                        label="Sponsored"
                        checked={formData.has_sponsor}
                        onChange={(value) => {
                            if (!value) clearFields();
                            updateField('has_sponsor', value)
                        }}
                        description="I have a sponsor"
                        isEditing={isEditing}
                        className='col-span-full'
                    />
                    <div className="col-span-full mb-5"><hr /></div>
                    {formData.has_sponsor && (
                        <>
                            <EditableField
                                label="Full Name"
                                type="text"
                                value={String(formData.sponsor_name)}
                                onChange={(value) => updateField('sponsor_name', value)}
                                placeholder="name of your sponsor"
                                isEditing={isEditing}
                            />

                            <EditableField
                                label="Email"
                                type="text"
                                value={String(formData.sponsor_email)}
                                onChange={(value) => updateField('sponsor_email', value)}
                                placeholder="Email address of sponsor"
                                isEditing={isEditing}
                            />

                            <EditableField
                                label="Phone Number"
                                type="text"
                                value={String(formData.sponsor_phone_number)}
                                onChange={(value) => updateField('sponsor_phone_number', value)}
                                placeholder='Phone number of sponsor'
                                isEditing={isEditing}
                            />

                            <EditableField
                                label="Relationship"
                                type='text'
                                value={String(formData.sponsor_relationship)}
                                onChange={(value) => updateField('sponsor_relationship', value)}
                                placeholder="e.g Father, Mother, Brother, Sister..."
                                isEditing={isEditing}
                            />

                            <EditableField
                                label="Address"
                                type='text'
                                value={formData.sponsor_contact_address ?? ""}
                                onChange={(value) => updateField('sponsor_contact_address', value)}
                                placeholder="Address of sponsor"
                                isEditing={isEditing}
                            />
                        </>)}
                </div>)
            }


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