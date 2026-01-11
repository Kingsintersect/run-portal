"use client";

import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type FilePreviewProps = {
    file: File;
    recordCount: number;
    onRemove: () => void;
};

export default function FilePreview({ file, recordCount, onRemove }: FilePreviewProps) {
    const fileSize = (file.size / 1024).toFixed(1); // Size in KB

    return (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <FileText size={24} className="text-site-b-dark" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{file.name}</p>
                        <p className="text-sm text-gray-500">
                            {fileSize} KB • {recordCount} records
                        </p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="hover:bg-red-100 hover:text-red-600"
                >
                    <X size={18} />
                </Button>
            </div>
        </div>
    );
}