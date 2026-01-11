"use client";

import { getApplications } from "@/app/actions/applications";
import { useAuth } from "@/contexts/AuthContext";
import { Application } from "@/types/application";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useApplications() {
    const { access_token } = useAuth();
    const [filters, setFilters] = useState<Record<string, string>>({
        status: "",
        program: "",
        search: "",
    });

    const {
        data: applications = [],
        isLoading,
        error,
    } = useQuery<Application[]>({
        queryKey: ["applications", filters],
        queryFn: () => getApplications(filters, access_token!),
        enabled: (!!access_token && access_token.trim() !== "")
    });

    return {
        applications,
        isLoading,
        error,
        filters,
        setFilters,
    };
}