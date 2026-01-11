"use client";

import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubmitButtonProps = {
    className: string;
    disabled: boolean;
    isUploading: boolean;
    recordCount: number;
    onClick: () => void;
};

export default function SubmitButton({
    className,
    disabled,
    isUploading,
    recordCount,
    onClick
}: SubmitButtonProps) {
    return (
        <Button
            type="button"
            onClick={onClick}
            className={cn("w-full py-6 text-lg font-medium flex items-center justify-center gap-2", className)}
            disabled={disabled}
            variant={"default"}
        >
            {isUploading ? (
                <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    <Upload size={20} />
                    <span>Upload {recordCount > 0 ? `${recordCount} ` : ''}Users</span>
                </>
            )}
        </Button>
    );
}