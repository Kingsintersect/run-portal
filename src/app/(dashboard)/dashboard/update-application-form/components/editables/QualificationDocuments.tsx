"use client";

import { ApplicationDetailsType } from '@/schemas/admission-schema';
import { Edit3, FileStack, Save, X } from 'lucide-react';
import React, { useState } from 'react';
import { ROOT_IMAGE_URL } from '@/config';
import { useEditableSection } from '@/hooks/useEditableSection';
import { EditableFileUpload } from '@/components/forms/EditableDocumentPreviewer';
import { useAppContext } from '@/contexts/AppContext';

export interface QualificationDocumentsProps {
    application: ApplicationDetailsType;
}

// Define the type for qualification documents data
type QualificationDocumentsData = {
    first_school_leaving?: string | File;
    o_level?: string | File;
    degree_transcript?: string | File;
    hnd?: string | File;
    degree?: string | File;
    other_documents?: (string | File)[];
};

export default function QualificationDocuments({
    application,
}: QualificationDocumentsProps) {
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [originalNewFiles, setOriginalNewFiles] = useState<File[]>([]);
    const [fieldFiles, setFieldFiles] = useState<Record<string, File | null>>({});
    const { state } = useAppContext();

    const buildInitialData = (): QualificationDocumentsData => {
        const baseData: QualificationDocumentsData = {
            first_school_leaving: application.application.first_school_leaving || undefined,
            o_level: application.application.o_level || undefined,
            other_documents: application.application.other_documents || [],
        };

        // Only add business school specific fields if isUBS is true
        if (state.isUBS) {
            // Use type assertion for business school specific fields
            const app = application.application as QualificationDocumentsData;
            return {
                ...baseData,
                degree_transcript: app.degree_transcript || undefined,
                hnd: app.hnd || undefined,
                degree: app.degree || undefined,
            };
        }

        return baseData;
    };

    const {
        isEditing,
        formData,
        isSaving,
        hasChanges,
        handleEdit: handleEditBase,
        handleCancel: handleCancelBase,
        handleSave,
        updateField,
    } = useEditableSection<QualificationDocumentsData>({
        applicationId: (application.application.id || '').toString(),
        initialData: buildInitialData(),
        updateType: 'application',
    });

    // Extended handlers to include new files management
    const handleEdit = () => {
        setOriginalNewFiles([...newFiles]);
        handleEditBase();
    };

    const handleCancel = () => {
        setNewFiles([...originalNewFiles]);
        setFieldFiles({});
        handleCancelBase();
    };

    const handleFilesChange = (files: File[]) => {
        setNewFiles(files);
        // Get existing URLs from other_documents
        const existingUrls = Array.isArray(formData.other_documents)
            ? formData.other_documents.filter(item => typeof item === 'string')
            : [];
        // Update formData with URLs + new files
        updateField('other_documents', [...existingUrls, ...files] as (string | File)[]);
    };

    const handleSingleFileChange = (field: keyof QualificationDocumentsData, files: File[]) => {
        if (files.length > 0) {
            setFieldFiles(prev => ({ ...prev, [field]: files[0] }));
            updateField(field, files[0]);
        } else {
            setFieldFiles(prev => ({ ...prev, [field]: null }));
            updateField(field, undefined);
        }
    };

    const handleImagesChange = (urls: string[]) => {
        // When URLs change (file removed), combine with new files
        updateField('other_documents', [...urls, ...newFiles] as (string | File)[]);
    };

    const hasActualChanges = () => {
        // Check if any field has a new file
        const hasNewFieldFiles = Object.values(fieldFiles).some(file => file !== null);

        const newFilesChanged = newFiles.length !== originalNewFiles.length ||
            newFiles.some((file, index) =>
                !originalNewFiles[index] ||
                file.name !== originalNewFiles[index].name ||
                file.size !== originalNewFiles[index].size
            );

        return hasChanges || newFilesChanged || hasNewFieldFiles;
    };

    const canSave = () => {
        return hasActualChanges();
    };

    // Helper to get string value for display
    const getFileValue = (value: string | File | undefined): string => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return ''; // For File objects, we'll handle them separately
    };

    return (
        <div id='official-documents' className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header with Edit/Save buttons */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileStack className="w-10 h-10 mr-2 text-purple-600" />
                    Qualification Documents
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 gap-x-10">
                {!state.isUBS && <div></div>}
                <EditableFileUpload
                    label="First school leaving certificate"
                    value={[getFileValue(formData.first_school_leaving)]}
                    onChange={(urls) => updateField('first_school_leaving', urls[0])}
                    onFilesChange={(files) => handleSingleFileChange('first_school_leaving', files)}
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    multiple={false}
                    maxFiles={1}
                    maxSize={10}
                    isEditing={isEditing}
                    baseUrl={ROOT_IMAGE_URL}
                    showPreview={true}
                    className=''
                />
                <EditableFileUpload
                    label="O'Level certificate"
                    value={[getFileValue(formData.o_level)]}
                    onChange={(urls) => updateField('o_level', urls[0])}
                    onFilesChange={(files) => handleSingleFileChange('o_level', files)}
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    multiple={false}
                    maxFiles={1}
                    maxSize={10}
                    isEditing={isEditing}
                    baseUrl={ROOT_IMAGE_URL}
                    showPreview={true}
                />

                {state.isUBS && (
                    <>
                        <EditableFileUpload
                            label="Degree certificate"
                            value={[getFileValue(formData.degree)]}
                            onChange={(urls) => updateField('degree', urls[0])}
                            onFilesChange={(files) => handleSingleFileChange('degree', files)}
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            multiple={false}
                            maxFiles={1}
                            maxSize={10}
                            isEditing={isEditing}
                            baseUrl={ROOT_IMAGE_URL}
                            showPreview={true}
                        />
                        <EditableFileUpload
                            label="HND certificate"
                            value={[getFileValue(formData.hnd)]}
                            onChange={(urls) => updateField('hnd', urls[0])}
                            onFilesChange={(files) => handleSingleFileChange('hnd', files)}
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            multiple={false}
                            maxFiles={1}
                            maxSize={10}
                            isEditing={isEditing}
                            baseUrl={ROOT_IMAGE_URL}
                            showPreview={true}
                        />
                        <EditableFileUpload
                            label="Transcript Document"
                            value={[getFileValue(formData.degree_transcript)]}
                            onChange={(urls) => updateField('degree_transcript', urls[0])}
                            onFilesChange={(files) => handleSingleFileChange('degree_transcript', files)}
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            multiple={false}
                            maxFiles={1}
                            maxSize={10}
                            isEditing={isEditing}
                            baseUrl={ROOT_IMAGE_URL}
                            showPreview={true}
                        />
                    </>
                )}
            </div>
            <hr className="my-5" />

            {/* Multiple other document upload */}
            <EditableFileUpload
                label="Other relevant documents (you can add multiple files)"
                value={
                    Array.isArray(formData.other_documents)
                        ? formData.other_documents.filter(item => typeof item === 'string') as string[]
                        : []
                }
                onChange={handleImagesChange}
                onFilesChange={handleFilesChange}
                accept=".pdf,.doc,.docx,.jpg,.png"
                multiple={true}
                maxFiles={5}
                maxSize={10}
                isEditing={isEditing}
                baseUrl={ROOT_IMAGE_URL}
                showPreview={true}
            />

            {/* Unsaved changes warning */}
            {isEditing && hasActualChanges() && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        You have unsaved changes. Make sure to save before leaving this section.
                    </p>
                </div>
            )}
        </div>
    );
}
