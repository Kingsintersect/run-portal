"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PayTuitionFee } from '@/app/actions/student';
import { notify } from '@/contexts/ToastProvider';
import { useRouter } from 'next/navigation';
import { FULL_TUITION_FEE } from '@/config';

// Context type definitions
export type PaymentType = 'full' | 'installment' | 'outstanding';

export type TuitionPaymentContextType = {
    openModal: boolean;
    paymentType: PaymentType;
    amount: number;
    setAmount: (amount: number) => void;
    handleOpenModal: (state: boolean) => void;
    setPaymentType: (type: PaymentType) => void;
    processPayment: () => Promise<void>;
    calculateOutstandingBalance: (paid: number) => number;
    validationError: string | null;
    isProcessing: boolean;
    hasPiadAcceptanceFee: boolean;
};

const TuitionPaymentContext = createContext<TuitionPaymentContextType | null>(null);

export const useTuitionPayment = () => {
    const context = useContext(TuitionPaymentContext);
    if (!context) {
        throw new Error('useTuitionPayment must be used within a TuitionPaymentProvider');
    }
    return context;
};

export const TuitionPaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const { access_token, user } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [paymentType, setPaymentType] = useState<PaymentType>('full');
    const [amount, setAmount] = useState(FULL_TUITION_FEE);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasPiadAcceptanceFee, setHasPiadAcceptanceFee] = useState(true);

    const calculateOutstandingBalance = useCallback((paid: number) => {
        return FULL_TUITION_FEE - (Number(paid) || 0);
    }, []);

    const handleOpenModal = useCallback((state: boolean) => {
        if (user?.acceptance_fee_payment_status !== "FULLY_PAID") {
            setHasPiadAcceptanceFee(false)
            return;
        }
        setHasPiadAcceptanceFee(true)
        setOpenModal(state);
        setValidationError(null);
    }, [user?.acceptance_fee_payment_status]);

    const validatePayment = useCallback(() => {
        setValidationError(null);

        if (paymentType === 'installment' && amount < FULL_TUITION_FEE / 2) {
            setValidationError('Amount must be at least 50% (₦97,500 or more)');
            return false;
        }

        if (paymentType === 'outstanding') {
            const outstanding = calculateOutstandingBalance(user?.tuition_amount_paid || 0);
            if (amount !== outstanding) {
                setValidationError(`Your outstanding fee is ₦${outstanding.toLocaleString()}`);
                return false;
            }
        }

        return true;
    }, [amount, paymentType, calculateOutstandingBalance, user]);

    const processPayment = async () => {
        if (!validatePayment() || !access_token) return;

        try {
            setIsProcessing(true);
            const { error, success } = await PayTuitionFee(access_token, { amount });

            if (error) {
                notify({
                    message: "Tuition Payment Was Unsuccessful",
                    variant: "error",
                    timeout: 5000
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
        paymentType,
        amount,
        setAmount,
        handleOpenModal,
        setPaymentType,
        processPayment,
        calculateOutstandingBalance,
        validationError,
        isProcessing,
        hasPiadAcceptanceFee
    };

    return (
        <TuitionPaymentContext.Provider value={value}>
            {children}
        </TuitionPaymentContext.Provider>
    );
};