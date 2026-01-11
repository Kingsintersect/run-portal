'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function ReactQueryProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
                refetchOnWindowFocus: false,
                retry: (failureCount, error) => {
                    if (error?.message?.includes('401') || error?.message?.includes('403')) {
                        return false;
                    }
                    return failureCount < 3;
                },
            },
            mutations: {
                retry: 1,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}