"use client";

import ProtectedRoute from '@/components/ProtectedRoute'
import { Roles } from '@/config'
import { ApplicationReviewProvider } from '@/contexts/ApplicationReviewContext';
import { useSearchParams } from 'next/navigation';
import { ApplicationReviewHeader } from './components/ApplicationReviewHeader';
import { ApplicationContainer } from './components/ApplicationContainer';

const UpdateApplicationForm = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || '';
    return (
        <ProtectedRoute allowedRoles={[Roles.STUDENT, Roles.ADMIN]}>
            <div className="min-h-screen">
                <ApplicationReviewProvider>
                    <ApplicationReviewHeader applicationId={id} />
                    <ApplicationContainer id={id} />
                </ApplicationReviewProvider>
            </div>
        </ProtectedRoute>
    )
}

export default UpdateApplicationForm