"use client";
import { apiUrl } from "@/config";
import { createContext, useContext, useEffect, useState } from "react";

const SessionContext = createContext<{ session: any; loading: boolean } | null>(null);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<{ access_token: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch(`${apiUrl}/session`);
                if (!res.ok) throw new Error("Failed to fetch session");
                const data = await res.json();
                setSession(data);
            } catch (error) {
                // console.error("Error fetching session:", error);
                setSession(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    return (
        <SessionContext.Provider value={{ session, loading }}>
            {children}
        </SessionContext.Provider>
    );
};

// Hook to access session
export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) throw new Error("useSession must be used within a SessionProvider");
    return context;
};
