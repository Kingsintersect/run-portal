'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useController, Control } from 'react-hook-form';
import { Upload, X, Eye, FileText, ImageIcon, FileSpreadsheet } from 'lucide-react';
import { createPortal } from 'react-dom';

interface FileUploaderProps {
    name: string;
    control: Control<any>;
    label?: string;
    required?: boolean;
    accept?: string;
    maxSize?: number; // in MB
    existingFileUrl?: string;
    multiple?: boolean;
    maxFiles?: number;
}

interface FilePreview {
    file: File | null;
    preview: string | null;
    type: string;
    name: string;
    url?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    name,
    control,
    label = 'Upload File',
    required = false,
    accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx',
    maxSize = 10,
    existingFileUrl,
    multiple = false,
    maxFiles = 5,
}) => {
    const [files, setFiles] = useState<FilePreview[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        field: { value: fieldValue, onChange },
        fieldState: { error },
    } = useController({
        name,
        control,
        rules: { required: required ? `${label} is required` : false },
    });

    // Initialize files from form data when component mounts or fieldValue changes
    useEffect(() => {
        if (fieldValue) {
            if (multiple && Array.isArray(fieldValue)) {
                // Handle multiple files
                const filePreviews = fieldValue.map((file: File) => ({
                    file,
                    preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
                    type: file.type,
                    name: file.name,
                }));
                setFiles(filePreviews);
            } else if (fieldValue instanceof File) {
                // Handle single file
                setFiles([{
                    file: fieldValue,
                    preview: fieldValue.type.startsWith('image/') ? URL.createObjectURL(fieldValue) : null,
                    type: fieldValue.type,
                    name: fieldValue.name,
                }]);
            }
        } else if (existingFileUrl) {
            // Handle existing file URL
            setFiles([{
                file: null,
                preview: existingFileUrl,
                type: 'image',
                name: 'Existing file',
                url: existingFileUrl
            }]);
        } else {
            setFiles([]);
        }
    }, [fieldValue, multiple, existingFileUrl]);

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8" />;
        if (type.includes('pdf')) return <FileText className="w-8 h-8" />;
        if (type.includes('sheet') || type.includes('excel')) return <FileSpreadsheet className="w-8 h-8" />;
        return <FileText className="w-8 h-8" />;
    };

    const processFile = useCallback((file: File): Promise<FilePreview | null> => {
        return new Promise((resolve) => {
            // Validate file size
            if (file.size > maxSize * 1024 * 1024) {
                alert(`File ${file.name} is too large. Max size is ${maxSize}MB`);
                return resolve(null);
            }

            const filePreview: FilePreview = {
                file,
                preview: null,
                type: file.type,
                name: file.name,
            };

            // Generate preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    filePreview.preview = reader.result as string;
                    resolve(filePreview);
                };
                reader.readAsDataURL(file);
            } else {
                resolve(filePreview);
            }
        });
    }, [maxSize]);

    const handleFileChange = useCallback(async (newFiles: FileList | File[] | null) => {
        if (!newFiles || newFiles.length === 0) return;

        const fileArray = Array.from(newFiles);

        // Check max files limit
        if (multiple && files.length + fileArray.length > maxFiles) {
            alert(`Maximum ${maxFiles} files allowed`);
            return;
        }

        if (!multiple && fileArray.length > 1) {
            alert('Only one file allowed');
            return;
        }

        const processedFiles = await Promise.all(fileArray.map(processFile));
        const validFiles = processedFiles.filter(f => f !== null && f !== undefined);

        if (multiple) {
            const newFilesList = [...files, ...validFiles];
            setFiles(newFilesList);
            onChange(newFilesList.map(f => f.file).filter(Boolean));
        } else {
            setFiles(validFiles);
            onChange(validFiles[0]?.file || null);
        }
    }, [files, multiple, maxFiles, onChange, processFile]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    }, [handleFileChange]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDelete = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);

        if (multiple) {
            onChange(newFiles.map(f => f.file).filter(Boolean));
        } else {
            onChange(null);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePreview = (filePreview: FilePreview) => {
        if (filePreview.preview) {
            // For images, show modal
            setModalImage(filePreview.preview);
            setShowModal(true);
        } else if (filePreview.file) {
            // For documents, create a temporary URL and open in new tab
            const fileUrl = URL.createObjectURL(filePreview.file);
            window.open(fileUrl, '_blank');
            setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
        } else if (filePreview.url) {
            // For existing files, open the URL
            window.open(filePreview.url, '_blank');
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
                {multiple && <span className="text-gray-500 text-xs ml-2">(Max {maxFiles} files)</span>}
            </label>

            {files.length === 0 || (multiple && files.length < maxFiles) ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragging
                        ? 'border-primary bg-purple-50 scale-105'
                        : 'border-gray-300 hover:border-primary/50 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50'
                        }`}
                >
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
                            <Upload className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-700">
                                {files.length === 0
                                    ? 'Drop your file here or click to browse'
                                    : `Add ${multiple ? 'more files' : 'another file'}`
                                }
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Supports images, PDF, DOC, DOCX, Excel (Max {maxSize}MB)
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}

            {files.length > 0 && (
                <div className="space-y-3 mt-4">
                    {files.map((filePreview, index) => (
                        <div
                            key={index}
                            className="relative border-2 border-blue-200 rounded-xl p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-md"
                        >
                            <div className="flex items-center space-x-4">
                                {filePreview.preview ? (
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-md flex-shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={filePreview.preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
                                        {getFileIcon(filePreview.type)}
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                        {filePreview.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {filePreview.type || 'Document file'}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => handlePreview(filePreview)}
                                        className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
                                        title="Preview"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(index)}
                                        className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
                                        title="Delete"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
            />

            {error && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error.message}</p>
            )}

            {/* Preview Modal */}
            {showModal && modalImage && createPortal(
                <div
                    className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
                    onClick={() => setShowModal(false)}
                >
                    <button
                        type='button'
                        onClick={() => setShowModal(false)}
                        className="absolute top-6 right-6 p-3 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-xl z-10 border-2 border-white"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={modalImage}
                        alt="Full preview"
                        className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>,
                document.body
            )}
        </div>
    );
};
