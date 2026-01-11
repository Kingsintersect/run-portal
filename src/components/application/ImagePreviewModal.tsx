import { getSafeImageUrl } from "@/lib/imageUrl";
import { Download, X } from "lucide-react";
import React from "react";

// Custom Image Preview Modal Component
export const ImagePreviewModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    imageName?: string;
}> = ({ isOpen, onClose, imageUrl, imageName }) => {
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-[80vw] h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {imageName || 'Image Preview'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Close"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Scrollable Image Container */}
                <div className="flex-1 overflow-auto p-4 bg-gray-50">
                    <div className="flex items-center justify-center min-h-full">
                        <img
                            src={getSafeImageUrl(imageUrl)}
                            alt={imageName || 'Preview'}
                            className="max-w-full h-auto rounded-lg shadow-lg"
                            style={{ maxHeight: 'none' }} // Allow full height
                        />
                    </div>
                </div>

                {/* Footer with actions */}
                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
                    <button
                        onClick={() => {
                            const a = document.createElement('a');
                            a.href = imageUrl;
                            a.download = imageName || 'image';
                            a.click();
                        }}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </button>
                    <button
                        onClick={onClose}
                        className="inline-flex items-center px-3 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};