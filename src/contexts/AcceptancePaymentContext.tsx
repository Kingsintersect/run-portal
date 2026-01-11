"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PayAcceptanceFee } from '@/app/actions/student';
import { notify } from '@/contexts/ToastProvider';
import { useRouter } from 'next/navigation';
import { extractErrorMessages } from '@/lib/errorsHandler';
import { ACCEPTANCE_FEE } from "@/config"


export type AcceptancePaymentContextType = {
    openModal: boolean;
    amount: number;
    setAmount: (amount: number) => void;
    handleOpenModal: (state: boolean) => void;
    processPayment: () => Promise<void>;
    isProcessing: boolean;
    hasAppliedForAdmission: boolean;
    hasBeenAdmitted: boolean;
};

const AcceptancePaymentContext = createContext<AcceptancePaymentContextType | null>(null);

export const useAcceptancePayment = () => {
    const context = useContext(AcceptancePaymentContext);
    if (!context) {
        throw new Error('useAcceptancePayment must be used within a AcceptancePaymentProvider');
    }
    return context;
};

export const AcceptancePaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const { access_token, user } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [amount, setAmount] = useState(ACCEPTANCE_FEE);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasAppliedForAdmission, setHasAppliedForAdmission] = useState(true);
    const [hasBeenAdmitted, setHasBeenAdmitted] = useState(true);

    const handleOpenModal = useCallback((state: boolean) => {
        if (!user?.is_applied) {
            setHasAppliedForAdmission(false)
            return;
        }
        if (user?.admission_status !== "ADMITTED") {
            setHasBeenAdmitted(false)
            return;
        }
        setHasAppliedForAdmission(true)
        setHasBeenAdmitted(true)
        setOpenModal(state);
        setValidationError(null);
    }, [user?.is_applied, user?.admission_status]);

    const validatePayment = useCallback(() => {
        setValidationError(null);
        if (amount <= 0) {
            setValidationError("Please enter a valid amount.");
            return false;
        }
        return true;
    }, [amount]);

    const processPayment = async () => {
        if (!validatePayment() || !access_token) return;

        try {
            setIsProcessing(true);
            const { error, success } = await PayAcceptanceFee(access_token, { amount });

            if (error) {
                const errorMessages = extractErrorMessages(error);
                errorMessages.forEach((msg) => {
                    notify({ message: msg, variant: "error", timeout: 10000 });
                });
                console.error("Payment Error:", error.message);
                return;
            }

            if (success) {
                setOpenModal(false);
                localStorage.setItem("acceptance_data", success.data);
                router.push(success.data.authorizationUrl);
                router.refresh();
            }
        } catch (err) {
            console.error("Payment processing error:", err);
            notify({
                message: "An unexpected error occurred",
                variant: "error",
                timeout: 5000
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const value = {
        openModal,
        amount,
        setAmount,
        handleOpenModal,
        processPayment,
        validationError,
        isProcessing,
        hasAppliedForAdmission,
        hasBeenAdmitted,
    };

    return (
        <AcceptancePaymentContext.Provider value={value}>
            {children}
        </AcceptancePaymentContext.Provider>
    );
};