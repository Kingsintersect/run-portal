
import { GetListOfLocalGovInState } from '@/app/actions/server.admin';
import { remoteApiUrl } from '@/config';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

export const useFetchLocalGovermentAreas = (state?: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['lga', state],
        queryFn: async () => {
            const { success, error } = await GetListOfLocalGovInState(state!);
            if (success) return success.data;
            if (error) throw new Error("Failed ti fetch local government areas")
        },
        enabled: options?.enabled ?? !!state,
    });
};

export const useExternalPrograms = () => {
    const { access_token } = useAuth();
    return useQuery({
        queryKey: ['programs', access_token],
        queryFn: () => getLmsPrograms(0, access_token ?? ""),
    });
};





// HELPER FUNCTIONS
export type LMSProgramType = {
    id: number;
    name: string;
};
export async function getLmsPrograms(parent_id: string | number, access_token: string) {
    const response = await fetch(`${remoteApiUrl}/odl/our-programs?parent_id=${parent_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Payment verification failed');
    }

    const data = await response.json();
    return data;
}