"use client";

import SwitchToggle from "@/components/ui/inputs/SwitchToggle";
import React, { useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { notify } from "@/contexts/ToastProvider";
import { Loader2 } from "lucide-react";
import { extractErrorMessages } from "@/lib/errorsHandler";
import { useSession } from "@/contexts/SessionContext ";

interface StatusToggleProps {
    id: string;
    status: 1 | 0;
    method: (id: string, access_token: string, status: { status: 1 | 0 }) => Promise<{ success: boolean, error?: string }>;
}

// ✅ Separate FacultyStatusToggle component
export const StatusToggle: React.FC<StatusToggleProps> = ({ id, status, method }) => {
    const [isChecked, setIsChecked] = useState(status === 1);
    const { access_token } = useAuth();

    const toggleStatus = async () => {
        const newStatus = isChecked ? 0 : 1; // Toggle status

        if (access_token) {
            try {
                const { error, success } = await method(id, access_token, { status: newStatus }); // Update in DB
                if (success) {
                    setIsChecked(!isChecked);
                    notify({ message: 'Status Updated!', variant: "success", timeout: 5000 })
                }
                if (error) {
                    const errorMessages = extractErrorMessages(error);
                    errorMessages.forEach((msg) => {
                        notify({ message: msg, variant: "error", timeout: 10000 });
                    });
                    return;
                }
            } catch (error) {
                console.error("Error updating status:", error);
                setIsChecked(isChecked); // Revert on failure
            }
        }

    };

    return (
        <SwitchToggle
            classList="mx-auto"
            checked={isChecked}
            onChange={toggleStatus}
            label=""
            name="status"
        />
    );
};


// Extract session fetching logic into a separate React component
export const StatusCell: React.FC<{ row: { original: { id: string; status: 1 | 0 } }, method }> = ({ row, method }) => {
    const { session, loading } = useSession(); // Use the reusable hook

    if (loading) return <Loader2 className="animate-spin" />;
    if (!session) return <span>Error fetching session</span>;

    return (
        <StatusToggle
            id={row.original.id}
            status={row.original.status}
            method={method}
        />
    );
};