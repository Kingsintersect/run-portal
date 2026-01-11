"use client";

import { CheckCircle, AlertCircle } from "lucide-react";
import { SpinLoader } from "@/components/ui/content-loader";
import { UploadState } from "@/hooks/useCreateUsers";

type UploadStatusIndicatorProps = {
    state: UploadState;
};

export default function UploadStatusIndicator({ state }: UploadStatusIndicatorProps) {
    if (state.status === 'idle') return null;

    // Custom Progress Bar (since we don't have the Progress component)
    const ProgressBar = ({ value }: { value: number }) => (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
                className="bg-site-b h-2 rounded-full transition-all duration-300"
                style={{ width: `${value}%` }}
            />
        </div>
    );

    if (state.status === 'uploading') {
        return (
            <div className="space-y-2">
                <ProgressBar value={state.progress} />
                <div className="flex items-center justify-center">
                    <SpinLoader />
                    <p className="text-center text-gray-700 ml-2">
                        {Math.round(state.progress)}% - {state.message}
                    </p>
                </div>
            </div>
        );
    }

    if (state.status === 'success') {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-green-700">{state.message}</p>
            </div>
        );
    }

    if (state.status === 'error') {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{state.message}</p>
            </div>
        );
    }

    return null;
}