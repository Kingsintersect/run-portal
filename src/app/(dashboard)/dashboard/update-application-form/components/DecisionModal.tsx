"use client";

import { Textarea } from '@/components/ui/textarea';
import { ApplicationDetailsType } from '@/schemas/admission-schema';
import { admissionDecitionActionData, ApplicationRejectValues, applicationReview } from '@/schemas/applicationReview-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface DecisionModalProps {
    decisionType: 'ADMITTED' | 'NOT_ADMITTED';
    application: ApplicationDetailsType | null | undefined;
    onClose: () => void;
    onSubmit: (values?: admissionDecitionActionData | undefined) => Promise<void>;
    isLoading: boolean;
}

export const DecisionModal = ({
    decisionType,
    application,
    onClose,
    onSubmit,
    isLoading,
}: DecisionModalProps) => {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<ApplicationRejectValues>({
        resolver: zodResolver(applicationReview),
        defaultValues: {
            application_id: String(application?.id),
            reason: '',
        },
    });

    const application_id = String(application?.id);
    const program = application?.program as string;
    const program_id = String(application?.program_id);
    const study_mode = application?.application.studyMode as string;
    const academic_session = application?.academic_session as string;
    const semester = application?.academic_semester as string;

    // Handle form submission differently based on decision type
    const handleFormSubmit = async (formData: ApplicationRejectValues) => {
        if (decisionType === 'ADMITTED') {
            // For approval, we don't need form data
            await onSubmit({ application_id, program, program_id, study_mode, academic_session, semester });
        } else {
            // For rejection, pass the form data
            await onSubmit({
                application_id,
                reason: formData.reason
            });
        }
    };

    // Handle direct approval (bypass form validation)
    const handleDirectApproval = async () => {
        await onSubmit({ application_id, program, program_id, study_mode, academic_session, semester });
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-xl w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {decisionType === 'ADMITTED' ? 'Approve Application' : 'Reject Application'}
                </h3>

                {decisionType !== 'ADMITTED' ? (
                    // Rejection form with validation
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for Rejection
                                </label>
                                <input type="hidden" {...register('application_id')} />
                                <Textarea
                                    {...register('reason')}
                                    rows={8}
                                    placeholder="Please provide a reason for rejection..."
                                    className='rounded-xl'
                                />
                                {errors.reason && (
                                    <p className="text-sm text-red-500">{errors.reason.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                disabled={isSubmitting || isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                                className="px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {(isSubmitting || isLoading) ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Reject Application'
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    // Approval confirmation (no form needed)
                    <div className="space-y-4">
                        <div className="w-full space-y-5 my-10 text-left">
                            <div className="flex flex-row gap-5">
                                <div className="w-32 font-bold text-lg text-orange-950">PROGRAM: </div>
                                <div className="grow text-gray-700">{program}</div>
                            </div>
                            <div className="flex flex-row gap-5">
                                <div className="w-32 font-bold text-lg text-orange-950">STUDY MODE: </div>
                                <div className="grow text-gray-700">{study_mode}</div>
                            </div>
                            <div className="flex flex-row gap-5">
                                <div className="w-32 font-bold text-lg text-orange-950">BEGINS: </div>
                                <div className="grow text-gray-700">
                                    {academic_session}
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 text-sm text-center">
                                Are you sure you want to approve this application? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                disabled={isSubmitting || isLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDirectApproval}
                                disabled={isSubmitting || isLoading}
                                className="px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {(isSubmitting || isLoading) ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Approve Application'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
