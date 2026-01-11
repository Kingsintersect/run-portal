"use client";

import { notify } from "@/contexts/ToastProvider";
import { AlertCircle, FileText, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { FieldValues, Path, UseFormSetValue } from "react-hook-form";

/**
 * usage
 * <DocumentUpload
  name="documents"
  setValue={setValue}
  uploadFn={uploadFile}
  multiple
  maxFiles={10}
  maxSize={10} // 10MB per file
  existingFiles={[
    "https://example.com/document.pdf",
    "https://example.com/image.jpg",
    { url: "https://example.com/custom.docx", name: "Custom Document" }
  ]}
  previewOnly={false}
/>
*
*<DocumentUpload
  name="document"
  setValue={setValue}
  uploadFn={uploadFile}
  existingFiles={["https://example.com/doc.pdf"]}
  previewOnly={true}
/>
 */

interface UploadedFile {
    name: string;
    url: string;
    type: string;
}

interface DocumentUploadProps<T extends FieldValues> {
    name: Path<T>;
    title?: string;
    error?: string;
    onFileChange?: (files: File[] | null) => void;
    setValue: UseFormSetValue<T>;
    uploadFn?: (file: File) => Promise<{ success?: { message: string; file_url: string }; error?: string }>;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number; // in MB
    existingFiles?: (string | UploadedFile)[]; // Files from database or parent component (can be just URLs)
    previewOnly?: boolean; // If true, only show preview without upload functionality
}

export function DocumentUpload<T extends FieldValues>({
    name,
    title,
    error,
    onFileChange,
    setValue,
    uploadFn,
    multiple = false,
    maxFiles = 5,
    maxSize = 5,
    existingFiles = [],
    previewOnly = false,
}: DocumentUploadProps<T>) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Utility functions for file type detection
    const getFileNameFromUrl = (url: string): string => {
        try {
            // Extract filename from URL path
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.split('/').pop() || 'unknown';

            // If no extension, try to get it from search params or default
            if (!filename.includes('.')) {
                return 'document';
            }

            return decodeURIComponent(filename);
        } catch {
            // If URL parsing fails, try simple string manipulation
            const parts = url.split('/');
            const lastPart = parts[parts.length - 1];
            const filename = lastPart.split('?')[0]; // Remove query params
            return filename || 'document';
        }
    };

    const getFileExtension = (filename: string): string => {
        const parts = filename.toLowerCase().split('.');
        return parts.length > 1 ? parts[parts.length - 1] : '';
    };

    const getMimeTypeFromExtension = (extension: string): string => {
        const mimeTypes: Record<string, string> = {
            // Images
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'bmp': 'image/bmp',
            'webp': 'image/webp',
            'svg': 'image/svg+xml',
            'ico': 'image/x-icon',
            'tiff': 'image/tiff',
            'tif': 'image/tiff',

            // Documents
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt': 'text/plain',
            'rtf': 'application/rtf',
            'csv': 'text/csv',

            // Archives
            'zip': 'application/zip',
            'rar': 'application/x-rar-compressed',
            '7z': 'application/x-7z-compressed',

            // Other
            'json': 'application/json',
            'xml': 'application/xml',
            'html': 'text/html',
            'css': 'text/css',
            'js': 'application/javascript',
        };

        return mimeTypes[extension] || 'application/octet-stream';
    };

    const normalizeFile = (file: string | UploadedFile): UploadedFile => {
        if (typeof file === 'string') {
            // It's just a URL, extract all info from it
            const filename = getFileNameFromUrl(file);
            const extension = getFileExtension(filename);
            const mimeType = getMimeTypeFromExtension(extension);

            return {
                name: filename,
                url: file,
                type: mimeType
            };
        } else {
            // It's already an object, but make sure it has all required fields
            const filename = file.name || getFileNameFromUrl(file.url);
            const extension = getFileExtension(filename);
            const mimeType = file.type || getMimeTypeFromExtension(extension);

            return {
                name: filename,
                url: file.url,
                type: mimeType
            };
        }
    };

    const getFileType = (file: File | UploadedFile): string => {
        // First try to get type from file.type if it exists
        if ('type' in file && file.type) {
            return file.type;
        }

        // Fallback: determine type from file extension
        if (!file.name || typeof file.name !== 'string') {
            return 'application/octet-stream'; // Default if no name available
        }

        const extension = file.name.toLowerCase().split('.').pop();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

        if (extension && imageExtensions.includes(extension)) {
            return 'image/*';
        }

        return 'application/octet-stream';
    };

    const isImageFile = (file: File | UploadedFile): boolean => {
        const type = getFileType(file);
        return type.startsWith('image/');
    };

    const handleUpload = async (file: File) => {
        if (file.size > maxSize * 1024 * 1024) {
            notify({
                message: `File is too large. Max size is ${maxSize}MB`,
                variant: "error",
                timeout: 5000,
            });
            return null;
        }

        setUploading(true);
        try {
            if (!uploadFn) {
                throw new Error("Upload function not provided");
            }

            const { success, error } = await uploadFn(file);
            if (success) {
                notify({
                    message: success.message,
                    variant: "success",
                    timeout: 5000,
                });
                return {
                    name: file.name,
                    url: success.file_url,
                    type: file.type
                };
            } else {
                console.error("Upload failed:", error);
                notify({
                    message: error || "Document Upload Failed. Try Again",
                    variant: "error",
                    timeout: 5000,
                });
                return null;
            }
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = async (newFiles: FileList | File[]) => {
        if (!newFiles || newFiles.length === 0 || previewOnly) return;

        // Convert FileList to array and apply limits
        const filesArray = Array.from(newFiles).slice(0, maxFiles - files.length);

        if (filesArray.length + files.length > maxFiles) {
            notify({
                message: `You can upload a maximum of ${maxFiles} files`,
                variant: "error",
                timeout: 5000,
            });
            return;
        }

        const uploadResults = await Promise.all(filesArray.map(handleUpload));
        const successfulUploads = uploadResults.filter((result): result is UploadedFile => result !== null);

        if (successfulUploads.length > 0) {
            const updatedFiles = [...files, ...successfulUploads];
            setFiles(updatedFiles);
            updateFormValue(updatedFiles);
            onFileChange?.(filesArray);
        }
    };

    const updateFormValue = (fileList: UploadedFile[]) => {
        if (multiple) {
            setValue(name, fileList.map(f => f.url) as any);
        } else {
            setValue(name, fileList[0]?.url as any);
        }
    };

    const handleDeleteFile = (index: number) => {
        if (previewOnly) return;

        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        updateFormValue(updatedFiles);
        onFileChange?.(updatedFiles.length > 0 ? null : null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (!previewOnly) {
            handleFileChange(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!previewOnly) {
            setDragActive(true);
        }
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const renderFilePreview = (file: UploadedFile, index: number) => {
        const isImage = isImageFile(file);

        return (
            <div
                key={index}
                className="relative group"
            >
                {isImage ? (
                    <div className="relative">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <Image
                                src={file.url}
                                alt={String(file.name)}
                                fill
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback to file icon if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.innerHTML = `
                                            <div class="w-full h-full flex items-center justify-center">
                                                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                        `;
                                    }
                                }}
                            />
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate w-24" title={file.name || 'Unknown file'}>
                            {file.name || 'Unknown file'}
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-24 h-24 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate w-24" title={file.name || 'Unknown file'}>
                            {file.name || 'Unknown file'}
                        </p>
                    </div>
                )}

                {!previewOnly && (
                    <button
                        type="button"
                        onClick={() => handleDeleteFile(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={uploading}
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
        );
    };

    // Initialize files with existing files
    useEffect(() => {
        if (existingFiles.length > 0) {
            const normalizedFiles = existingFiles.map(normalizeFile);
            setFiles(normalizedFiles);
            updateFormValue(normalizedFiles);
        }
    }, [existingFiles]);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {title ?? `${previewOnly ? 'View' : 'Upload'} Document${multiple ? "s" : ""}`}
                {!previewOnly && <span className="text-red-500">*</span>}
            </label>

            {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                    {files.map((file, index) => renderFilePreview(file, index))}
                </div>
            )}

            {!previewOnly && (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                        } ${files.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,image/*"
                        onChange={(e) => handleFileChange(e.target.files || [])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        multiple={multiple}
                        disabled={files.length >= maxFiles}
                    />

                    {files.length >= maxFiles ? (
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-500">
                                    Maximum number of files reached
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Remove a file to upload more
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                <Upload className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">
                                    Drop your {multiple ? "files" : "file"} here, or click to browse
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {multiple
                                        ? `PDF, Word, Excel, Images — up to ${maxFiles} files (${maxSize}MB each)`
                                        : `PDF, Word, Excel, Images — up to ${maxSize}MB`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {uploading && (
                <p className="text-sm text-gray-500">Uploading files...</p>
            )}

            {error && typeof error === "string" && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
}


// // ACCEPTS MULTIPLE DOCUMENT

// "use client";

// import { notify } from "@/contexts/ToastProvider";
// import { AlertCircle, FileText, Upload, X } from "lucide-react";
// import { useState } from "react";
// import type { FieldValues, Path, UseFormSetValue } from "react-hook-form";

// /**
//  * usage
//  * <DocumentUpload
//   name="documents"
//   setValue={setValue}
//   uploadFn={uploadFile}
//   multiple
//   maxFiles={10}
//   maxSize={10} // 10MB per file
// />
// *
// *<DocumentUpload
//   name="document"
//   setValue={setValue}
//   uploadFn={uploadFile}
// />
//  */

// interface UploadedFile {
//     name: string;
//     url: string;
// }

// interface DocumentUploadProps<T extends FieldValues> {
//     name: Path<T>;
//     title?: string;
//     error?: string;
//     onFileChange?: (files: File[] | null) => void;
//     setValue: UseFormSetValue<T>;
//     uploadFn: (file: File) => Promise<{ success?: { message: string; file_url: string }; error?: string }>;
//     multiple?: boolean;
//     maxFiles?: number;
//     maxSize?: number; // in MB
// }

// export function DocumentUpload<T extends FieldValues>({
//     name,
//     title,
//     error,
//     onFileChange,
//     setValue,
//     uploadFn,
//     multiple = false,
//     maxFiles = 5,
//     maxSize = 5,
// }: DocumentUploadProps<T>) {
//     const [files, setFiles] = useState<UploadedFile[]>([]);
//     const [dragActive, setDragActive] = useState(false);
//     const [uploading, setUploading] = useState(false);

//     const handleUpload = async (file: File) => {
//         if (file.size > maxSize * 1024 * 1024) {
//             notify({
//                 message: `File is too large. Max size is ${maxSize}MB`,
//                 variant: "error",
//                 timeout: 5000,
//             });
//             return null;
//         }

//         setUploading(true);
//         try {
//             const { success, error } = await uploadFn(file);
//             if (success) {
//                 notify({
//                     message: success.message,
//                     variant: "success",
//                     timeout: 5000,
//                 });
//                 return { name: file.name, url: success.file_url };
//             } else {
//                 console.error("Upload failed:", error);
//                 notify({
//                     message: error || "Document Upload Failed. Try Again",
//                     variant: "error",
//                     timeout: 5000,
//                 });
//                 return null;
//             }
//         } finally {
//             setUploading(false);
//         }
//     };

//     const handleFileChange = async (newFiles: FileList | File[]) => {
//         if (!newFiles || newFiles.length === 0) return;

//         // Convert FileList to array and apply limits
//         const filesArray = Array.from(newFiles).slice(0, maxFiles - files.length);

//         if (filesArray.length + files.length > maxFiles) {
//             notify({
//                 message: `You can upload a maximum of ${maxFiles} files`,
//                 variant: "error",
//                 timeout: 5000,
//             });
//             return;
//         }

//         const uploadResults = await Promise.all(filesArray.map(handleUpload));
//         const successfulUploads = uploadResults.filter((result): result is UploadedFile => result !== null);

//         if (successfulUploads.length > 0) {
//             const updatedFiles = [...files, ...successfulUploads];
//             setFiles(updatedFiles);
//             updateFormValue(updatedFiles);
//             onFileChange?.(filesArray);
//         }
//     };

//     const updateFormValue = (fileList: UploadedFile[]) => {
//         if (multiple) {
//             setValue(name, fileList.map(f => f.url) as any);
//         } else {
//             setValue(name, fileList[0]?.url as any);
//         }
//     };

//     const handleDeleteFile = (index: number) => {
//         const updatedFiles = files.filter((_, i) => i !== index);
//         setFiles(updatedFiles);
//         updateFormValue(updatedFiles);
//         onFileChange?.(updatedFiles.length > 0 ? null : null);
//     };

//     const handleDrop = (e: React.DragEvent) => {
//         e.preventDefault();
//         setDragActive(false);
//         handleFileChange(e.dataTransfer.files);
//     };

//     const handleDragOver = (e: React.DragEvent) => {
//         e.preventDefault();
//         setDragActive(true);
//     };

//     const handleDragLeave = () => {
//         setDragActive(false);
//     };

//     return (
//         <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
//                 <FileText className="w-4 h-4" />
//                 {title ?? `Upload Document${multiple ? "s" : ""}`}
//                 <span className="text-red-500">*</span>
//             </label>

//             <div
//                 className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${dragActive
//                     ? "border-blue-500 bg-blue-50"
//                     : "border-gray-300 hover:border-gray-400"
//                     }`}
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//             >
//                 <input
//                     type="file"
//                     accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,image/*"
//                     onChange={(e) => handleFileChange(e.target.files || [])}
//                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                     multiple={multiple}
//                 />

//                 {files.length > 0 ? (
//                     <div className="space-y-4">
//                         <div className="grid gap-2">
//                             {files.map((file, index) => (
//                                 <div
//                                     key={index}
//                                     className="flex items-center justify-between p-2 bg-gray-50 rounded"
//                                 >
//                                     <div className="flex items-center gap-2 truncate">
//                                         <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
//                                         <span className="text-sm text-gray-700 truncate">
//                                             {file.name}
//                                         </span>
//                                     </div>
//                                     <button
//                                         type="button"
//                                         onClick={() => handleDeleteFile(index)}
//                                         className="text-gray-500 hover:text-red-500"
//                                         disabled={uploading}
//                                     >
//                                         <X className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>

//                         {files.length < maxFiles && (
//                             <div className="flex flex-col items-center space-y-3 pt-2">
//                                 <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
//                                     <Upload className="w-5 h-5 text-gray-400" />
//                                 </div>
//                                 <div className="text-center">
//                                     <p className="text-sm font-medium text-gray-700">
//                                         {multiple
//                                             ? "Drop more files here, or click to browse"
//                                             : "Drop a different file here, or click to browse"}
//                                     </p>
//                                     <p className="text-xs text-gray-500 mt-1">
//                                         {multiple
//                                             ? `You can upload up to ${maxFiles} files (${maxSize}MB each)`
//                                             : `Max size: ${maxSize}MB`}
//                                     </p>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="flex flex-col items-center space-y-3">
//                         <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
//                             <Upload className="w-8 h-8 text-gray-400" />
//                         </div>
//                         <div className="text-center">
//                             <p className="text-sm font-medium text-gray-700">
//                                 Drop your {multiple ? "files" : "file"} here, or click to browse
//                             </p>
//                             <p className="text-xs text-gray-500 mt-1">
//                                 {multiple
//                                     ? `PDF, Word, Excel, Images — up to ${maxFiles} files (${maxSize}MB each)`
//                                     : `PDF, Word, Excel, Images — up to ${maxSize}MB`}
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {uploading && (
//                 <p className="text-sm text-gray-500">Uploading files...</p>
//             )}

//             {error && typeof error === "string" && (
//                 <p className="text-sm text-red-600 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {error}
//                 </p>
//             )}
//         </div>
//     );
// }



// // accepts only one document

// // "use client";

// // import { XButton } from "@/components/XButton";
// // import { notify } from "@/contexts/ToastProvider";
// // import { AlertCircle, FileText, Upload } from "lucide-react";
// // import { useState } from "react";
// // import type { FieldValues, Path, UseFormSetValue } from "react-hook-form";

// // interface DocumentUploadProps<T extends FieldValues> {
// //     name: Path<T>;
// //     title?: string;
// //     error?: string;
// //     onFileChange?: (file: File | null) => void;
// //     setValue: UseFormSetValue<T>;
// //     uploadFn: (file: File) => Promise<{ success?: { message: string; file_url: string }, error?: string }>;
// // }

// // export function DocumentUpload<T extends FieldValues>({
// //     name,
// //     title,
// //     error,
// //     onFileChange,
// //     setValue,
// //     uploadFn,
// // }: DocumentUploadProps<T>) {
// //     const [fileName, setFileName] = useState<string | null>(null);
// //     const [dragActive, setDragActive] = useState(false);

// //     const handleUpload = async (file: File) => {
// //         const { success, error } = await uploadFn(file);
// //         if (success) {
// //             setValue(name, success.file_url as any); // cast to satisfy `setValue`
// //             notify({ message: success.message, variant: "success", timeout: 5000 });
// //             return true;
// //         } else {
// //             console.error("Upload failed:", error);
// //             notify({ message: 'Document Upload Failed. Try Again', variant: "error", timeout: 5000 });
// //             return false;
// //         }
// //     };

// //     const handleFileChange = (file: File | null) => {
// //         if (file) {
// //             handleUpload(file);
// //             setFileName(file.name);
// //         } else {
// //             setFileName(null);
// //         }
// //         onFileChange?.(file);
// //     };

// //     const handleDeleteFile = () => {
// //         setFileName(null);
// //         setValue(name, null as any); // Reset the field value
// //         onFileChange?.(null);
// //     };

// //     const handleDrop = (e: React.DragEvent) => {
// //         e.preventDefault();
// //         setDragActive(false);

// //         const files = e.dataTransfer.files;
// //         if (files && files[0]) {
// //             handleFileChange(files[0]);
// //         }
// //     };

// //     const handleDragOver = (e: React.DragEvent) => {
// //         e.preventDefault();
// //         setDragActive(true);
// //     };

// //     const handleDragLeave = () => {
// //         setDragActive(false);
// //     };

// //     return (
// //         <div className="space-y-2">
// //             <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
// //                 <FileText className="w-4 h-4" />
// //                 {title ?? "Upload Document"}
// //                 <span className="text-red-500">*</span>
// //             </label>

// //             <div
// //                 className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${dragActive
// //                     ? 'border-blue-500 bg-blue-50'
// //                     : 'border-gray-300 hover:border-gray-400'
// //                     }`}
// //                 onDrop={handleDrop}
// //                 onDragOver={handleDragOver}
// //                 onDragLeave={handleDragLeave}
// //             >
// //                 <input
// //                     type="file"
// //                     accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,image/*"
// //                     onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
// //                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
// //                 />

// //                 {fileName ? (
// //                     <div className="flex flex-col items-center space-y-3">
// //                         <div className="flex items-center gap-2">
// //                             <FileText className="w-6 h-6 text-gray-600" />
// //                             <span className="text-sm text-gray-700">{fileName}</span>
// //                             <XButton onClick={handleDeleteFile} />
// //                         </div>
// //                         <p className="text-sm text-gray-600">Click to change document or use delete button</p>
// //                     </div>
// //                 ) : (
// //                     <div className="flex flex-col items-center space-y-3">
// //                         <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
// //                             <Upload className="w-8 h-8 text-gray-400" />
// //                         </div>
// //                         <div className="text-center">
// //                             <p className="text-sm font-medium text-gray-700">
// //                                 Drop your document here, or click to browse
// //                             </p>
// //                             <p className="text-xs text-gray-500 mt-1">
// //                                 PDF, Word, Excel, Images — up to 5MB
// //                             </p>
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>

// //             {error && typeof error === 'string' && (
// //                 <p className="text-sm text-red-600 flex items-center gap-1">
// //                     <AlertCircle className="w-4 h-4" />
// //                     {error}
// //                 </p>
// //             )}
// //         </div>
// //     );
// // }
