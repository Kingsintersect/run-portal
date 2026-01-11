import { APPLICATION_FEE } from '@/config';
import { useStudentApplicationStatus } from '@/contexts/StudentStatusContext';
import { formatToCurrency } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export const AdmissionProgressTrack = ({ user, reloadUser, loadingUser }) => {
    const { missingDoc, isLoading } = useStudentApplicationStatus();

    const [admissionSteps, setAdmissionSteps] = useState<Array<{
        id: number;
        title: string;
        description: string;
        completed: boolean;
        current: boolean;
        reveal: boolean;
    }>>([]);

    useEffect(() => {
        if (loadingUser && isLoading && !user) return;
        const hasMissingDocuments = (missingDoc?.length ?? 0) > 0;

        setAdmissionSteps(
            [
                {
                    id: 1,
                    title: "Pay Application Fee",
                    description: `Pay ${formatToCurrency(APPLICATION_FEE)} to start your admission process`,
                    completed: user?.application_payment_status === "FULLY_PAID",
                    current: !user?.application_payment_status || user?.application_payment_status === "UNPAID",
                    reveal: true,
                },
                {
                    id: 2,
                    title: "Fill Admission Form",
                    description: "Complete your admission application with personal and academic details",
                    completed: Boolean(user?.is_applied),
                    current: Boolean(user?.is_applied),
                    reveal: true,
                },
                {
                    id: 3,
                    title: "Upload Documents",
                    description: "Upload required documents (BSc result, Transcript Document, O'Level certificates, etc.)",
                    completed: hasMissingDocuments,
                    current: hasMissingDocuments,
                    reveal: true,
                },
                {
                    id: 4,
                    title: "Submit Application",
                    description: "Review and submit your complete application for review",
                    completed: Boolean(user?.admission_status === "INPROGRESS"),
                    current: Boolean(user?.admission_status === "INPROGRESS"),
                    reveal: true,
                },
                {
                    id: 5,
                    title: "Wait for Review",
                    description: "Our admissions team will review your application",
                    completed: Boolean(user?.admission_status === "INPROGRESS"),
                    current: Boolean(user?.admission_status === "INPROGRESS"),
                    reveal: true,
                }
            ]
        )
    }, [user, loadingUser, isLoading, missingDoc?.length]);

    useEffect(() => {
        reloadUser();
    }, [reloadUser]);
    return (
        <div className="bg-white rounded-xl shadow-sm border p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Your Admission Process</h3>

            <div className="space-y-6">
                {admissionSteps.map((step) => (
                    <div key={step.id} className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed
                                ? 'bg-green-500 text-white'
                                : step.current
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                {step.completed ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : (
                                    <span className="text-sm font-medium">{step.id}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex-1">
                            <h4 className={`font-medium ${step.completed
                                ? 'text-green-700'
                                : step.current
                                    ? 'text-blue-700'
                                    : 'text-gray-500'
                                }`}>
                                {step.title}
                            </h4>
                            <p className={`text-sm mt-1 ${step.completed
                                ? 'text-green-600'
                                : step.current
                                    ? 'text-blue-600'
                                    : 'text-gray-500'
                                }`}>
                                {step.description}
                            </p>
                        </div>

                        {step.current && (
                            <div className="flex-shrink-0">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    Current Step
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
