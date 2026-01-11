import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStudentApplicationData, updateStudentPersonalInfoData } from '@/app/actions/applications';
import { toastSuccess, toastApiError } from '@/lib/toastApiError';

type UpdateType = 'application' | 'personal';

interface UseEditableSectionOptions<T> {
    applicationId: string;
    initialData: T;
    updateType: UpdateType;
    onSuccess?: () => void;
}

export function useEditableSection<T extends Record<string, unknown>>({
    applicationId,
    initialData,
    updateType,
    onSuccess,
}: UseEditableSectionOptions<T>) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<T>(initialData);
    const [originalData, setOriginalData] = useState<T>(initialData);
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: async (data: T) => {
            if (updateType === 'application') {
                return updateStudentApplicationData(applicationId, data);
            } else {
                return updateStudentPersonalInfoData(data);
            }
        },
        onSuccess: () => {
            toastSuccess('Changes saved successfully');
            setOriginalData(formData);
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
            onSuccess?.();
        },
        onError: (error) => {
            console.error('Update failed:', error);
            toastApiError('Failed to save changes');
        }
    });

    const handleEdit = () => {
        setOriginalData(formData);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
    };

    const handleSave = async () => {
        await updateMutation.mutateAsync(formData);
    };

    const updateField = <K extends keyof T>(field: K, value: T[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    return {
        isEditing,
        formData,
        isSaving: updateMutation.isPending,
        hasChanges,
        handleEdit,
        handleCancel,
        handleSave,
        updateField,
    };
}