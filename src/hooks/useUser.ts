// hooks/useUser.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInterface } from "@/config/Types";
import { apiCall } from "@/lib/apiCaller";
import { FetchUserResponse } from "@/contexts/AuthContext";

export function useAuthSession() {
    return useQuery({
        queryKey: ["access_token"],
        queryFn: async () => {
            const res = await fetch("/api/user");
            if (!res.ok) throw new Error("Failed to get session");

            const data = await res.json();
            if (!data?.user) {
                throw new Error("Access token not found in session data");
            }
            return { user: data.user, access_token: data.access_token };
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
}

// export function useUser() {
//     const { data: sessionData, isLoading: loadingToken } = useAuthSession();
//     const access_token = sessionData?.access_token;
//     const queryClient = useQueryClient();

//     const query = useQuery({
//         queryKey: ["user"],
//         enabled: !!access_token && !loadingToken,
//         queryFn: () =>
//             apiCall<null, UserInterface>({
//                 url: "/application/profile",
//                 method: "GET",
//                 accessToken: access_token,
//                 credentials: "omit",
//                 cache: "no-store",
//             }),
//         staleTime: 30000,
//         refetchOnWindowFocus: false,
//     });

//     // Function to manually refresh user data
//     const refreshUser = async () => {
//         await query.refetch();
//         // Also invalidate the session to ensure consistency
//         await queryClient.invalidateQueries({ queryKey: ["access_token"] });
//     };

//     // Function to update user data optimistically
//     const updateUserOptimistically = (newUserData: Partial<UserInterface>) => {
//         queryClient.setQueryData(["user"], (oldData: { success?: UserInterface } | undefined) => {
//             if (!oldData?.success) return oldData;
//             return {
//                 ...oldData,
//                 success: { ...oldData.success, ...newUserData }
//             };
//         });
//     };

//     return {
//         ...query,
//         refreshUser,
//         updateUserOptimistically,
//     };
// }



// Custom hook for specific user update scenarios

export function useUserUpdates() {
    const queryClient = useQueryClient();
    const { data: sessionData } = useAuthSession();
    const access_token = sessionData?.access_token;

    const updateProfile = async (profileData: Partial<UserInterface>) => {
        if (!access_token) throw new Error("No access token available");

        // Optimistic update
        queryClient.setQueryData(["user"], (oldData: { success?: UserInterface } | undefined) => {
            if (!oldData?.success) return oldData;
            return {
                ...oldData,
                success: { ...oldData.success, ...profileData }
            };
        });

        try {
            const response = await apiCall<Partial<UserInterface>, FetchUserResponse>({
                url: "/application/profile",
                method: "PUT",
                data: profileData,
                accessToken: access_token,
            });

            if (response?.status === 200) {
                // Update session
                await fetch('/api/session/update-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: response?.user }),
                });

                // Invalidate and refetch to ensure consistency
                await queryClient.invalidateQueries({ queryKey: ["user"] });
                await queryClient.invalidateQueries({ queryKey: ["access_token"] });
            }

            return response;
        } catch (error) {
            // Revert optimistic update on error
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            throw error;
        }
    };

    interface TuitionPaymentData {
        amount: number;
        currency: string;
        paymentMethod: string;
    }

    const payTuitionFee = async (paymentData: TuitionPaymentData) => {
        if (!access_token) throw new Error("No access token available");

        try {
            const response = await apiCall<TuitionPaymentData, FetchUserResponse>({
                url: "/application/payment/tuition",
                method: "POST",
                data: paymentData,
                accessToken: access_token,
            });

            if (response?.status === 200) {
                // Refresh user data to get updated payment status
                await queryClient.invalidateQueries({ queryKey: ["user"] });
                await queryClient.invalidateQueries({ queryKey: ["access_token"] });
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    return {
        updateProfile,
        payTuitionFee,
    };
}
