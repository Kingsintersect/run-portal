"use client";

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { baseUrl } from '@/config'
import { PaymentVerificationCard } from '../components/PaymentVerificationCard';
import { toast } from 'sonner';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';

const VerifyApplicationPayment = () => {
   const searchParams = useSearchParams();
   const transRef = searchParams.get('transRef');
   const [verificationResult, setVerificationResult] = useState<{
      status: string;
      message: string;
      amount?: number;
      paymentDate?: string;
   } | null>(null);

   const router = useRouter();
   const { mutate: verifyPayment, isPending } = usePaymentVerification();

   useEffect(() => {
      if (!transRef) {
         toast.error('Payment reference is missing');
         router.push('/auth/signup');
         return;
      }
   }, [transRef, router]);

   const handleVerify = () => {
      if (!transRef) return;

      verifyPayment(
         { transRef },
         {
            onSuccess: (data) => {
               setVerificationResult(data);
            },
         }
      );
   };
   const handleRedirect = () => {
      // router.push(`${baseUrl}/auth/signin?transRef=${transRef}`);
      router.push(`${baseUrl}/admission`);
      router.refresh();
   }

   if (!transRef) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
               <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h1>
               <p className="text-gray-600">Payment reference is required</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
         <PaymentVerificationCard
            paymentRef={transRef || ''}
            isVerifying={isPending}
            verificationResult={verificationResult}
            onVerify={handleVerify}
            onProceed={handleRedirect}
            autoVerify={false}
         />
      </div>
   )
}

export default VerifyApplicationPayment