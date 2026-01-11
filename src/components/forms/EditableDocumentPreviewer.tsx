import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Eye, FileText, ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { getSafeImageUrl } from '@/lib/imageUrl';

interface FileItem {
    url?: string;
    file?: File;
    name: string;
    size?: number;
    isImage: boolean;
}

interface EditableFileUploadProps {
    label: string;
    value: string[]; // URLs from database
    onChange: (urls: string[]) => void;
    onFilesChange?: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number; // in MB
    isEditing: boolean;
    className?: string;
    baseUrl?: string;
    showPreview?: boolean;
}

export const EditableFileUpload: React.FC<EditableFileUploadProps> = ({
    label,
    value = [],
    onChange,
    onFilesChange,
    accept = "*/*",
    multiple = false,
    maxFiles = 5,
    maxSize = 10,
    isEditing,
    className = "",
    baseUrl = "",
    showPreview = true
}) => {
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewImageName, setPreviewImageName] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Helper: Check if URL is valid
    const isValidUrl = (url: string | null | undefined): boolean => {
        if (!url || url.trim() === '' || url === 'null' || url === 'undefined') {
            return false;
        }
        return true;
    };

    // // Helper: Check if URL is valid
    // const isValidUrl = (url: string | null | undefined): boolean => {
    //     if (!url || url.trim() === '' || url === 'null' || url === 'undefined') {
    //         return false;
    //     }
    //     return true;
    // };

    // Helper: Check if file/URL is an image
    const isImageFile = (fileOrUrl: string | File): boolean => {
        if (fileOrUrl instanceof File) {
            return fileOrUrl.type.startsWith('image/');
        }
        if (typeof fileOrUrl === 'string') {
            const extension = fileOrUrl.split('.').pop()?.toLowerCase() || '';
            return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension);
        }
        return false;
    };

    // Helper: Format file size
    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return 'Unknown size';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Filter valid URLs and convert to unified format
    const validUrls = value.filter(isValidUrl);

    const allFiles: FileItem[] = [
        ...validUrls.map(url => ({
            url,
            name: url.split('/').pop() || 'Unknown file',
            isImage: isImageFile(url)
        })),
        ...newFiles.map(file => ({
            file,
            name: file.name,
            size: file.size,
            isImage: file.type.startsWith('image/')
        }))
    ];

    // Get full URL for display
    const getFileUrl = (fileItem: FileItem): string => {
        if (fileItem.url) {
            return fileItem.url.startsWith('http') ? fileItem.url : baseUrl + fileItem.url;
        }
        if (fileItem.file) {
            return URL.createObjectURL(fileItem.file);
        }
        return '';
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        // Validate file size
        const validFiles = selectedFiles.filter(file => {
            if (file.size > maxSize * 1024 * 1024) {
                alert(`File ${file.name} exceeds ${maxSize}MB limit.`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // For single file mode, replace existing files
        if (!multiple) {
            setNewFiles(validFiles.slice(0, 1));
            if (onFilesChange) {
                onFilesChange(validFiles.slice(0, 1));
            }
            // Clear existing URLs when uploading new file in single mode
            // This triggers the onChange to notify parent of the change
            if (validUrls.length > 0) {
                onChange([]);
            }
        } else {
            // For multiple file mode, check total file limit
            const totalFiles = validUrls.length + newFiles.length + validFiles.length;
            if (totalFiles > maxFiles) {
                const allowedCount = maxFiles - validUrls.length - newFiles.length;
                if (allowedCount > 0) {
                    const limitedFiles = validFiles.slice(0, allowedCount);
                    alert(`Maximum ${maxFiles} files allowed. Adding ${allowedCount} file(s).`);
                    const updatedNewFiles = [...newFiles, ...limitedFiles];
                    setNewFiles(updatedNewFiles);
                    if (onFilesChange) {
                        onFilesChange(updatedNewFiles);
                    }
                } else {
                    alert(`Maximum ${maxFiles} files reached.`);
                    return;
                }
            } else {
                const updatedNewFiles = [...newFiles, ...validFiles];
                setNewFiles(updatedNewFiles);
                if (onFilesChange) {
                    onFilesChange(updatedNewFiles);
                }
            }
        }

        // Reset input
        e.target.value = '';
    };

    // Remove file
    const removeFile = (index: number) => {
        if (index < validUrls.length) {
            // Remove existing URL
            const newUrls = validUrls.filter((_, i) => i !== index);
            onChange(newUrls);
        } else {
            // Remove new file
            const newFileIndex = index - validUrls.length;
            const updatedNewFiles = newFiles.filter((_, i) => i !== newFileIndex);
            setNewFiles(updatedNewFiles);
            if (onFilesChange) {
                onFilesChange(updatedNewFiles);
            }
        }
    };

    // Open preview
    const handlePreview = (fileItem: FileItem) => {
        const url = getFileUrl(fileItem);
        if (fileItem.isImage) {
            setPreviewImage(url);
            setPreviewImageName(fileItem.name);
            setIsModalOpen(true);
        } else {
            window.open(url, '_blank');
        }
    };

    // Render empty state
    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <FileText className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 line-clamp-1">{label}</p>
            {!isEditing && <p className="text-xs text-gray-400 mt-1">No file uploaded</p>}
        </div>
    );

    // Render single file
    const renderSingleFile = (fileItem: FileItem, index: number) => (
        <div className="relative border rounded-lg overflow-hidden bg-white">
            {showPreview && fileItem.isImage ? (
                // Image preview
                <div className="relative w-full h-48 bg-gray-100">
                    <Image
                        src={getFileUrl(fileItem)}
                        alt={fileItem.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                </div>
            ) : (
                // Icon for document or when preview is off
                <div className="flex items-center justify-center h-32 bg-gray-50">
                    {fileItem.isImage ? (
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                    ) : (
                        <FileText className="w-16 h-16 text-blue-500" />
                    )}
                </div>
            )}

            {/* File info and actions */}
            <div className="p-4 bg-white">
                <p className="text-sm font-medium text-gray-800 truncate mb-1" title={fileItem.name}>
                    {fileItem.name}
                </p>
                {fileItem.size && (
                    <p className="text-xs text-gray-500 mb-3">{formatFileSize(fileItem.size)}</p>
                )}

                <div className="flex items-center justify-between">
                    {!isEditing && (
                        <button
                            onClick={() => handlePreview(fileItem)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                        </button>
                    )}

                    {isEditing && (
                        <>
                            <button
                                onClick={() => removeFile(index)}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                            >
                                <X className="w-4 h-4" />
                                <span>Remove</span>
                            </button>
                            {renderUploadSmallButton()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    // Render file grid item (for multiple files)
    const renderFileGridItem = (fileItem: FileItem, index: number) => (
        <div className="relative group aspect-square border rounded-lg overflow-hidden bg-white">
            {/* Preview area */}
            <div className="relative w-full h-full">
                {showPreview && fileItem.isImage ? (
                    <Image
                        src={getFileUrl(fileItem)}
                        alt={fileItem.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-50">
                        {fileItem.isImage ? (
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                        ) : (
                            <FileText className="w-12 h-12 text-blue-500" />
                        )}
                    </div>
                )}

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                        {!isEditing && (
                            <button
                                onClick={() => handlePreview(fileItem)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                title="View"
                            >
                                <Eye className="w-5 h-5 text-gray-700" />
                            </button>
                        )}
                        {isEditing && (
                            <button
                                onClick={() => removeFile(index)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                title="Remove"
                            >
                                <X className="w-5 h-5 text-red-600" />
                            </button>
                        )}
                    </div>
                </div>

                {/* File name */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-90 backdrop-blur-sm">
                    <p className="text-xs font-medium text-gray-800 truncate" title={fileItem.name}>
                        {fileItem.name}
                    </p>
                </div>
            </div>
        </div>
    );

    // Render upload button
    const renderUploadLargeButton = () => (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <input
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
                className="hidden"
                id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            />
            <label
                htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                className="cursor-pointer flex flex-col items-center"
            >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload</p>
                <p className="text-xs text-gray-500 mt-1">
                    Max {maxSize}MB {multiple && `(up to ${maxFiles} files)`}
                </p>
            </label>
        </div>
    );

    const renderUploadSmallButton = () => (
        <>
            <input
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
                className="hidden"
                id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            />
            <Button variant="outline" onClick={() => { }} size={"sm"} asChild>
                <label
                    htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                    className="cursor-pointer flex items-center"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                </label>
            </Button>
        </>
    )

    return (
        <>
            <div className={className}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>

                {allFiles.length === 0 ? (
                    // Empty state
                    isEditing ? renderUploadLargeButton() : renderEmptyState()
                ) : multiple ? (
                    // Multiple files grid
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                            {allFiles.map((fileItem, index) => (
                                <React.Fragment key={index}>
                                    {renderFileGridItem(fileItem, index)}
                                </React.Fragment>
                            ))}
                        </div>
                        {isEditing && renderUploadLargeButton()}
                    </>
                ) : (
                    // Single file
                    <>
                        {renderSingleFile(allFiles[0], 0)}
                    </>
                )}
            </div>

            {/* Image Preview Modal */}
            <ImagePreviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imageUrl={previewImage || ''}
                imageName={previewImageName}
            />
        </>
    );
};

// Image Preview Modal Component
interface ImagePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    imageName: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
    isOpen,
    onClose,
    imageUrl,
    imageName
}) => {
    if (!isOpen) return null;
    console.log('imageUrl', imageUrl)

    const safeImageUrl = getSafeImageUrl(imageUrl);
    console.log('safeImageUrl', safeImageUrl);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
            onClick={onClose}
        >
            <div
                className="relative max-w-7xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 truncate pr-4">
                        {imageName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                <div className="relative w-full h-[calc(90vh-80px)] flex items-center justify-center p-4">
                    <div className="relative w-full h-full">
                        <Image
                            src={safeImageUrl}
                            alt={imageName}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1200px) 100vw, 1200px"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};