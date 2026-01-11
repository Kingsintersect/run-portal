"use client";

import { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApplicationDetailsType } from '@/schemas/admission-schema';
import { ApplicationApproveValues, ApplicationRejectValues } from '@/schemas/applicationReview-schema';
import {
    ApproveStudentApplicantion,
    getStudentApplicantion,
    RejectStudentApplicantion
} from '@/app/actions/applications';
import { toastApiError, toastSuccess } from '@/lib/toastApiError';

type DecisionType = 'ADMITTED' | 'NOT_ADMITTED' | null;

type ApplicationReviewContextType = {
    // Modal state
    showDecisionModal: boolean;
    decisionType: DecisionType;
    openDecisionModal: (type: 'ADMITTED' | 'NOT_ADMITTED') => void;
    closeDecisionModal: () => void;

    // Mutations
    approveMutation: ReturnType<typeof useMutation<boolean, Error, ApplicationApproveValues>>;
    rejectMutation: ReturnType<typeof useMutation<boolean, Error, ApplicationRejectValues>>;
};

const ApplicationReviewContext = createContext<ApplicationReviewContextType | undefined>(undefined);

export const ApplicationReviewProvider = ({ children }: { children: React.ReactNode }) => {
    const [showDecisionModal, setShowDecisionModal] = useState(false);
    const [decisionType, setDecisionType] = useState<DecisionType>(null);
    const queryClient = useQueryClient();

    const openDecisionModal = (type: 'ADMITTED' | 'NOT_ADMITTED') => {
        setDecisionType(type);
        setShowDecisionModal(true);
    };

    const closeDecisionModal = () => {
        setShowDecisionModal(false);
        setDecisionType(null);
    };

    // Approve mutation
    const approveMutation = useMutation({
        mutationFn: (values: ApplicationApproveValues) => ApproveStudentApplicantion(values),
        onSuccess: (_, variables) => {
            toastSuccess("Application approved successfully");
            queryClient.invalidateQueries({
                queryKey: ['application', variables.application_id]
            });
            closeDecisionModal();
        },
        onError: (error) => {
            console.error('Approval failed:', error);
            toastApiError("Failed to approve application");
        }
    });

    // Reject mutation
    const rejectMutation = useMutation({
        mutationFn: (values: ApplicationRejectValues) => RejectStudentApplicantion(values),
        onSuccess: (_, variables) => {
            toastSuccess("Application rejected");
            queryClient.invalidateQueries({
                queryKey: ['application', variables.application_id]
            });
            closeDecisionModal();
        },
        onError: (error) => {
            console.error('Rejection failed:', error);
            toastApiError("Failed to reject application");
        }
    });

    return (
        <ApplicationReviewContext.Provider
            value={{
                showDecisionModal,
                decisionType,
                openDecisionModal,
                closeDecisionModal,
                approveMutation,
                rejectMutation,
            }}
        >
            {children}
        </ApplicationReviewContext.Provider>
    );
};

export const useApplicationReview = () => {
    const context = useContext(ApplicationReviewContext);
    if (!context) {
        throw new Error('useApplicationReview must be used within ApplicationReviewProvider');
    }
    return context;
};

// Simplified hook for fetching application
export const useApplication = (id: string) => {
    return useQuery<ApplicationDetailsType | null>({
        queryKey: ['application', id],
        queryFn: async () => {
            const res = await getStudentApplicantion(id);
            return res.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

