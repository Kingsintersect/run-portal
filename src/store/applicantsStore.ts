import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInterface } from '@/config/Types'

interface ApplicantsState {
    // All applicants data fetched from API
    allApplicants: UserInterface[]
    // Loading states
    isLoading: boolean
    isFetching: boolean
    error: string | null
    // Actions
    setAllApplicants: (applicants: UserInterface[]) => void
    setLoading: (loading: boolean) => void
    setFetching: (fetching: boolean) => void
    setError: (error: string | null) => void
    // Clear store
    clearStore: () => void
}

export const useApplicantsStore = create<ApplicantsState>()(
    persist(
        (set) => ({
            // Initial state
            allApplicants: [],
            isLoading: false,
            isFetching: false,
            error: null,

            // Actions
            setAllApplicants: (applicants) => set({ allApplicants: applicants }),

            setLoading: (loading) => set({ isLoading: loading }),

            setFetching: (fetching) => set({ isFetching: fetching }),

            setError: (error) => set({ error }),

            clearStore: () => set({
                allApplicants: [],
                isLoading: false,
                isFetching: false,
                error: null
            }),
        }),
        {
            name: 'applicants-store',
            // Don't persist loading states
            partialize: (state) => ({
                allApplicants: state.allApplicants,
            }),
        }
    )
)