'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Roles } from '@/config';
import LoadingSpinner from './ui/LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: Roles[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/signin');
        } else if (!loading && user && !allowedRoles.includes(user.role)) {
            if ([Roles.ADMIN, Roles.MANAGER].includes(user.role as Roles)) {
                if (pathname !== '/dashboard/admin') {
                    router.push('/dashboard/admin');
                }
            } else if ([Roles.TEACHER].includes(user.role as Roles)) {
                if (pathname !== '/dashboard/teacher') {
                    router.push('/dashboard/teacher');
                }
            } else {
                if (pathname !== '/dashboard/student') {
                    router.push('/dashboard/student');
                }
            }

        }
    }, [user, loading, router, allowedRoles, pathname]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
