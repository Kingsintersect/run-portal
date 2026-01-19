"use client";

import { useApplication, useApplicationReview } from '@/contexts/ApplicationReviewContext';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, Loader2 } from 'lucide-react';

export const ApplicationReviewHeader = ({ applicationId }: { applicationId: string }) => {
    const { data: application, isLoading } = useApplication(applicationId);
    const { openDecisionModal } = useApplicationReview();
    const { user } = useAuth();

    const isAdmin = user?.role === "ADMIN";
    const hasApplicationDetails = !!application?.application;
    const isPending = application?.admission_status?.toUpperCase() === 'PENDING';
    const showActions = isPending && isAdmin && hasApplicationDetails;

    return (
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Review Application</h1>
                        <p className="text-gray-600">
                            {isLoading ? (
                                <span className="flex items-center">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Loading application...
                                </span>
                            ) : application ? (
                                `${application.first_name} ${application.last_name} - ${application.program}`
                            ) : (
                                'RUN ODL - Application Review'
                            )}
                        </p>
                    </div>

                    {showActions && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => openDecisionModal('ADMITTED')}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                <span>Approve</span>
                            </button>
                            <button
                                onClick={() => openDecisionModal('NOT_ADMITTED')}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                <span>Reject</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// import { useApplicationReview } from '@/contexts/ApplicationReviewContext';
// import { useAuth } from '@/contexts/AuthContext';
// import { Check, X } from 'lucide-react';
// import React from 'react'

// export const ApplicationReviewHeader = () => {
//     const { currentApplication, handleDecision } = useApplicationReview();
//     const { user } = useAuth();
//     const isAdmin = user?.role === "ADMIN";

//     return (
//         <div className="bg-white shadow-sm border-b">
//             <div className="max-w-7xl mx-auto px-4 py-4">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">Review Application</h1>
//                         <p className="text-gray-600">ODL RUN - Application Review</p>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         {((currentApplication?.admission_status.toLowerCase() === 'pending') && isAdmin) && (
//                             <div className="flex space-x-2">
//                                 <button
//                                     onClick={() => handleDecision('ADMITTED')}
//                                     className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
//                                 >
//                                     <Check className="w-4 h-4" />
//                                     <span>Approve</span>
//                                 </button>
//                                 <button
//                                     onClick={() => handleDecision('NOT_ADMITTED')}
//                                     className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
//                                 >
//                                     <X className="w-4 h-4" />
//                                     <span>Reject</span>
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
