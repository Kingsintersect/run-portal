'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import AuthPageTemplate from '../component/AuthPageTemplate';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { SigninSchema } from './signin.types';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { InputFormField } from '@/components/ui/inputs/FormFields';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type SigninFormData = z.infer<typeof SigninSchema>;

export default function AuthPage() {
    const searchParams = useSearchParams();
    const referenceNumber = searchParams.get('email') || '';
    const callbackUrl = searchParams.get('callbackUrl') || '';
    const { initializeLogin, loading } = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting, isValid },
    } = useForm<SigninFormData>({
        resolver: zodResolver(SigninSchema),
        defaultValues: {
            reference: referenceNumber || undefined,
            password: ''
        }
    });

    useEffect(() => {
        if (referenceNumber) {
            // If reference number is present, set it in the form
            setValue('reference', referenceNumber);
        }
    }, [referenceNumber, setValue]);

    const onSubmit: SubmitHandler<SigninFormData> = async (data) => {
        await initializeLogin({ ...data, callbackUrl });
    };

    return (
        <AuthPageTemplate title={'LOGIN'} subTitle={'Please sign in to your account for more adventure!'}>
            <form onSubmit={handleSubmit(onSubmit)} className={cn(`block w-full space-y-4 md:space-y-6 text-left`)}>
                <div className="grid grid-cols-1 gap-5">
                    <InputFormField<SigninFormData>
                        type="text"
                        id={'reference'}
                        label="Email or Refrence number"
                        name="reference"
                        register={register}
                        error={errors.reference}
                    />
                    <InputFormField<SigninFormData>
                        type="password"
                        id={'password'}
                        label="Enter strong password"
                        name="password"
                        register={register}
                        error={errors.password}
                    />
                </div>
                <div className="w-full flex item-center justify-between my-2 py-2">
                    <div className="text-site-a">
                        <div className="flex items-center mb-4 gap-1">
                            <input
                                id={"remember"}
                                type="checkbox"
                                className={cn("peer/checkbox1 w-5 h-5 border-2 border-gray-300 focus:ring-0 dark:bg-gray-700 dark:border-gray-600")}
                            />
                            <label
                                htmlFor={`remember`}
                                className={cn("peer-checked/checkbox1:text-orange-400 peer-checked/checkbox1:font-bold block ms-2 font-normal text-gray-900 dark:text-gray-300")}
                            >
                                Remember me
                            </label>
                        </div>

                    </div>
                    <Link href={"/auth/forgot-password"} className="text-site-a">Forgot password?</Link>
                </div>

                <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="mt-4 w-full bg-site-b text-white px-4 py-2 rounded hover:bg-site-b/80 flex gap-3 justify-center items-center disabled:bg-gray-600  disabled:cursor-not-allowed"
                >
                    {(isSubmitting || loading)
                        ? (
                            <>
                                <span>Processing...</span>
                                <Loader2 className="animate-spin text-lg ml-5" />
                            </>
                        )
                        : ('Sign in')
                    }
                </button>
                <div className="w-full text-left mt-4">
                    New to our platform?
                    <Link href={"/auth/signup"} className="text-site-a font-semibold"> Apply for an admission</Link>
                </div>
            </form>
        </AuthPageTemplate>
    );
}
