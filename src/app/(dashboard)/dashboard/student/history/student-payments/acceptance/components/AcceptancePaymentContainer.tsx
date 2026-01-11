"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { HandCoins } from 'lucide-react';
import AcceptanceStatusCard from './AcceptanceStatusCard';
import AcceptancePaymentModal from './AcceptancePaymentModal';
import ContentLoader from '@/components/ui/content-loader';
import AdmissionDeniedBanner from '@/app/(dashboard)/dashboard/student/componenets/AdmissionDeniedBanner';

const AcceptancePaymentContainer = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <ContentLoader />
        );
    }

    if (!user) {
        return (
            <div className="py-16 px-4 bg-yellow-50 dark:bg-yellow-800/50 rounded-xl text-center">
                <div className="inline-flex justify-center items-center w-16 h-16 bg-yellow-100 dark:bg-yellow-700 rounded-full mb-4">
                    <HandCoins className="h-8 w-8 text-site-a dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-medium text-yellow-700 dark:text-yellow-300 mb-2">No Data Found</h3>
                <p className="text-site-a dark:text-yellow-400 max-w-md mx-auto">
                    Unable to load student information. Please try again later.
                </p>
            </div>
        );
    }

    if (user.admission_status === "NOT_ADMITTED") {
        return <AdmissionDeniedBanner statement={user.reason_for_denial as string} />;
    }

    return (
        <>
            <AcceptanceStatusCard student={user} />
            <AcceptancePaymentModal />
        </>
    );
};

export default AcceptancePaymentContainer;