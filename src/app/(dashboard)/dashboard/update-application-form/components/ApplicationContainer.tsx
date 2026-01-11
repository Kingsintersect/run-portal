"use client";

import { useApplication, useApplicationReview } from '@/contexts/ApplicationReviewContext';
import { ApplicationDetails } from './ApplicationDetails';
import { DecisionModal } from './DecisionModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { admissionDecitionActionData, ApplicationApproveValues, ApplicationRejectValues } from '@/schemas/applicationReview-schema';

export const ApplicationContainer = ({ id }: { id: string }) => {
    const { data: application, isLoading, error } = useApplication(id);
    const {
        showDecisionModal,
        decisionType,
        closeDecisionModal,
        approveMutation,
        rejectMutation,
    } = useApplicationReview();

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner size="lg" />
                    <span className="ml-3 text-gray-600">Loading application...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load application. Please try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        No application data found.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const handleSubmitDecision = async (values: admissionDecitionActionData | undefined) => {
        if (decisionType === 'ADMITTED') {
            await approveMutation.mutateAsync(values as ApplicationApproveValues);
        } else if (decisionType === 'NOT_ADMITTED') {
            await rejectMutation.mutateAsync(values as ApplicationRejectValues);
        }
    };

    const isSubmitting = approveMutation.isPending || rejectMutation.isPending;

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <ApplicationDetails application={application} />

            {showDecisionModal && decisionType && (
                <DecisionModal
                    decisionType={decisionType}
                    application={application}
                    onClose={closeDecisionModal}
                    onSubmit={handleSubmitDecision}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    );
};
