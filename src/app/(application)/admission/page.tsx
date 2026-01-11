"use client";

import { useAuth } from '@/contexts/AuthContext';
import { WelcomeCard } from './components/WelcomeCard';
import { ApplicationPaymentCard } from './components/ApplicationPaymentCard';
import { ApplicationFormCard } from './components/ApplicationFormCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DashboardCard } from './components/DashboardCard';
import { AdmissionProgressTrack } from './components/AdmissionProgressTrack';
import { StudentStatusProvider } from '@/contexts/StudentStatusContext';

export default function NewStudentLanding() {
    const { user, access_token, loading, refreshUserData, } = useAuth();
    const ApplicationPaymentStatus = user?.application_payment_status === "FULLY_PAID";
    const hasApplied = Boolean(user?.is_applied);

    return (

        <StudentStatusProvider>
            <div className="min-h-screen bg-gray-50 mt-20">
                {/* Main Content */}
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {loading
                        ? (
                            <div className='w-full h-screen/2 my-auto flex items-center justify-center'>
                                <LoadingSpinner size="md" className="mr-2" />
                                Loading your information...
                            </div>
                        )
                        : <>
                            {/* Welcome Section */}
                            <WelcomeCard user={user} />

                            {/* Current Status */}
                            {!ApplicationPaymentStatus && <ApplicationPaymentCard access_token={access_token} />}

                            {/* Application status */}
                            {(!hasApplied && ApplicationPaymentStatus) && <ApplicationFormCard />}

                            {(hasApplied) && <DashboardCard user={user} />}

                            {/* Admission Process Steps */}
                            <AdmissionProgressTrack user={user} reloadUser={refreshUserData} loadingUser={loading} />
                        </>}

                    {/* Important Information */}
                    <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Application fee is non-refundable</li>
                            <li>• You have 30 days to complete your application after payment</li>
                            <li>• Ensure all documents are clear and readable before uploading</li>
                            <li>• Check your email regularly for updates on your application status</li>
                        </ul>
                    </div>
                </main>
            </div>
        </StudentStatusProvider>
    );
}