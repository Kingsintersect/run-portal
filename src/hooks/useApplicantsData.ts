"use client";

import { useEffect } from 'react'
import { getAdmissionApplicants } from '@/app/actions/applications'
import { useApplicantsStore } from '@/store/applicantsStore'

interface UseApplicantsDataProps {
    refetch?: boolean
}

export function useApplicantsData({ refetch = false }: UseApplicantsDataProps = {}) {
    const {
        allApplicants,
        isLoading,
        isFetching,
        error,
        setAllApplicants,
        setLoading,
        setFetching,
        setError,
    } = useApplicantsStore()

    // Fetch all applicants data
    const fetchAllApplicants = async () => {
        try {
            setFetching(true)
            setError(null)

            // Fetch all data without pagination
            const result = await getAdmissionApplicants({
                pageIndex: 0,
                pageSize: 10000, // Large number to get all data
                sortBy: 'id',
                sortOrder: 'desc',
                search: '',
                filters: {},
            })

            if (result.data) {
                setAllApplicants(result.data)
            } else {
                throw new Error('Failed to fetch applicants data')
            }
        } catch (err) {
            console.error('Error fetching applicants:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch applicants')
        } finally {
            setFetching(false)
            setLoading(false)
        }
    }

    // Initial data fetch
    useEffect(() => {
        if (allApplicants.length === 0 || refetch) {
            setLoading(true)
            fetchAllApplicants()
        }
    }, [refetch])

    // Manual refetch function
    const refetchData = () => {
        fetchAllApplicants()
    }

    return {
        allApplicants,
        isLoading: isLoading || isFetching,
        error,
        refetchData,
        totalCount: allApplicants.length,
    }
}