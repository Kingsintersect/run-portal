"use client";

import { UploadPassport } from "@/app/actions/student";
import { XButton } from "@/components/XButton";
import { notify } from "@/contexts/ToastProvider";
import { AlertCircle, Camera, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const PhotoUploader = ({
    onFileChange,
    error,
    setValue,
    title,
}: {
    onFileChange: (file: File | null) => void;
    error?: string;
    setValue
    title?: string;
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const savePassportPhotograph = async (file: File) => {
        const { success, error } = await UploadPassport({ ["passport"]: file });
        if (success) {
            notify({ message: success.message, variant: "success", timeout: 5000 });
            setValue("passport", success.image_url);
            return true;
        } else {
            console.error("Upload failed:", error);
            notify({ message: 'Document Upload Failed. Try Again', variant: "error", timeout: 5000 });
            return false;
        }
    }

    const handleFileChange = async (file: File | null) => {
        if (file) {
            if (!(await savePassportPhotograph(file))) return
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
        onFileChange(file);
    };

    const handleDeletePhoto = () => {
        setPreview(null);
        onFileChange(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileChange(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Camera className="w-4 h-4" />
                {title ?? `Passport Photograph`}
                <span className="text-red-500">*</span>
            </label>

            <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {preview ? (
                    <div className="flex flex-col items-center space-y-3">
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                            <Image
                                src={preview}
                                fill
                                sizes="(max-width: 32px) 100vw, 32px"
                                alt="Passport preview"
                                className="w-full h-full object-cover"
                            />
                            <XButton onClick={handleDeletePhoto} />
                        </div>
                        <p className="text-sm text-gray-600">Click to change photo or use delete button</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">
                                Drop your passport photo here, or click to browse
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG up to 5MB
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
};
