// app/hooks/useAccessToken.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiClient } from '../lib/api-client';
import { useAuth } from '@/contexts/AuthContext';

export function useAccessToken() {
    const { access_token } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize token from localStorage
    useEffect(() => {
        if (access_token) {
            setToken(access_token);
            ApiClient.setAccessToken(access_token);
        }
        setIsLoading(false);
    }, [access_token]);

    // Update token
    const updateToken = useCallback((newToken: string | null) => {
        setToken(newToken);
        ApiClient.setAccessToken(newToken);
    }, []);

    // Clear token (logout)
    const clearToken = useCallback(() => {
        setToken(null);
        ApiClient.setAccessToken(null);
    }, []);

    return {
        token,
        isLoading,
        setToken: updateToken,
        clearToken,
        hasToken: !!token
    };
}