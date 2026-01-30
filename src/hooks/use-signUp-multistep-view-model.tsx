"use client";

import { GetAllProgram } from "@/app/actions/faculty.api";
import { APPLICATION_FEE, baseUrl, Gender, Nationality, State } from "@/config";
import { notify } from "@/contexts/ToastProvider";
import { extractErrorMessages, getReactHookFormErrorMessages } from "@/lib/errorsHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldName, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCurrentSemester, useCurrentSession } from "./useAccademics";
import { CreateStudentAccount } from "@/lib/services/user.services";
export const baseSignupSchema = z
    .object({
        id: z.string().optional(),
        first_name: z.string().min(1, { message: "First name is required" }),
        last_name: z.string().min(1, { message: "LAst name is required" }),
        other_name: z.string().optional(),
        username: z.string().min(1, { message: "Username is required" }),
        phone_number: z.string().min(1, { message: "Phone number is required" }),
        gender: z.string().refine((value) => value !== "", {
            message: "Your gender must be selected",
        }),
        nationality: z.string().refine((value) => value !== "", { message: "Nationality is required" }),
        state: z.string().refine((value) => value !== "", { message: "State is required" }),
        email: z.string().email({ message: "Please enter a valid email." }),
        password: z.string().min(6, { message: "Should be at least 6 characters long" }),
        password_confirmation: z.string(),
        amount: z.number().min(1, { message: "Amount is requird" }),

        // Program Selection
        program: z.string().min(1, 'Program selection is required'),
        program_id: z.string().min(1, 'Program selection is required'),

        // Accademic session
        academic_session: z.string().min(1, 'Invalid value for academic session'),
        academic_semester: z.string().min(1, 'Invalid value for academic semester'),
        start_year: z.string().min(1, 'Invalid value for start year'),
    })
export const SignupSchema = baseSignupSchema.refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
});

export type SignupFormData = z.infer<typeof SignupSchema>;
export type ProgramItem = { id: number; name: string; parent: number };

export interface Program {
    id: number;
    label: string;
    value: string;
}

const steps = [
    {
        id: 1,
        label: "Personal Info",
        fields: ["first_name", "last_name", "phone_number", "gender", "nationality", "state"],
    },
    {
        id: 2,
        label: "Program Listing",
        fields: ["program_id", "program"],
    },
    {
        id: 3,
        label: "Application Data",
        fields: ["email", "username", "password", "password_confirmation"],
    },
];

export default function useSignInMultiStepViewModel() {
    const [currentStep, setCurrentStep] = useState(1);
    const [previousStep, setPreviousStep] = useState(1);
    const delta = currentStep - previousStep;
    const router = useRouter();
    const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
    const [selectedProgramName, setSelectedProgramName] = useState<number | null>(null);

    const form = useForm<SignupFormData>({
        resolver: zodResolver(SignupSchema),
        mode: "onChange",
        defaultValues: {
            academic_session: "",
            academic_semester: "",
            start_year: "",
            amount: APPLICATION_FEE,
        }
    });

    const { register, handleSubmit, watch, reset, control, setValue, getValues, trigger, formState: { errors } } = form;
    const allErrors = getReactHookFormErrorMessages(errors);

    const { data: currentSession, isSuccess: isSessionLoaded } = useCurrentSession();
    const { data: currentSemester, isSuccess: isSemesterLoaded } = useCurrentSemester();

    useEffect(() => {
        // console.log('currentSession', currentSession)
        // console.log('currentSemester', currentSemester)
        if (isSessionLoaded && isSemesterLoaded) {
            reset({
                academic_session: currentSession?.name ?? "",
                academic_semester: currentSemester?.name ?? "",
                start_year: new Date().getFullYear().toString(),
                amount: APPLICATION_FEE,
            });
        }
    }, [isSessionLoaded, isSemesterLoaded, currentSession, currentSemester, reset]);

    const { data: programData, isLoading: isProgramsLoading } = useQuery({
        queryKey: ["programs"],
        queryFn: GetAllProgram,
        select: (res) => res?.success?.data || [],
    });

    // Extract parents
    const parentPrograms = useMemo(() => {
        return (programData || [])
            .filter((item: ProgramItem) => item.parent === 0)
            .map((item) => ({
                id: item.id,
                label: item.name.trim(),
                value: String(item.id),
            }));
    }, [programData]);

    // Extract children based on Selected Programme
    const childPrograms = useMemo(() => {
        return (programData || [])
            .filter((item: ProgramItem) => item.parent === selectedProgramId)
            .map((item) => ({
                id: item.id,
                label: item.name.trim(),
                value: String(item.id),
            }));
    }, [programData, selectedProgramId]);

    // Set selectedProgramId and setSelectedProgramName when user chooses from dropdown
    const handleProgramChange = useCallback((programId: string) => {
        const numericId = Number(programId);
        setSelectedProgramId(numericId);

        const selectedProgram = parentPrograms.find((p) => p.id === numericId);
        setSelectedProgramName(selectedProgram?.label || null);
    }, [parentPrograms]);


    const signUpMutation = useMutation({
        mutationFn: CreateStudentAccount,
        onSuccess: (res) => {
            notify({ message: "Successfully Created Account", variant: "success", timeout: 5000 });
            router.push(`${baseUrl}/auth/signin?email=${res.user_email}`);
        },
        onError: (error) => {
            const errorMessages = extractErrorMessages(error);
            console.error('errorMessages', errorMessages)
            errorMessages.forEach((msg) => {
                notify({ message: msg, variant: "error", timeout: 5000 });
            });
        },
    });

    const onSubmit = useCallback<SubmitHandler<SignupFormData>>((data, event) => {
        event?.preventDefault();
        signUpMutation.mutate(data);
    }, [signUpMutation]);

    const nextStep = useCallback(async () => {
        const fields = steps[currentStep - 1].fields;
        const isFieldsValid = await trigger(fields as FieldName<SignupFormData>[], { shouldFocus: true });

        if (!isFieldsValid) return;
        if (currentStep < steps.length) {
            setPreviousStep(currentStep);
            setCurrentStep((prev) => prev + 1);
        }
    }, [currentStep, trigger]);

    const prevStep = useCallback(() => {
        if (currentStep > 1) {
            setPreviousStep(currentStep);
            setCurrentStep((step) => Math.max(step - 1, 1));
        }
    }, [currentStep]);

    const NewGender = useMemo(() => Gender, []);
    const NewNationality = useMemo(() => Nationality, []);
    const NewState = useMemo(() => State, []);

    return useMemo(() => ({
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        register,
        handleSubmit,
        onSubmit,
        watch,
        reset,
        setValue,
        getValues,
        errors,
        allErrors,
        isSubmitting: signUpMutation.isPending,
        control,
        delta,
        steps,
        NewGender,
        NewNationality,
        NewState,
        parentPrograms,
        childPrograms,
        selectedProgramId,
        selectedProgramName,
        isProgramsLoading,
        handleProgramChange,
        APPLICATION_FEE,
    }), [
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        register,
        handleSubmit,
        onSubmit,
        watch,
        reset,
        errors,
        allErrors,
        signUpMutation.isPending,
        control,
        setValue,
        getValues,
        delta,
        parentPrograms,
        childPrograms,
        selectedProgramId,
        selectedProgramName,
        handleProgramChange,
        isProgramsLoading,
        NewGender,
        NewNationality,
        NewState,
    ]);
}
