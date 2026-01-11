"use client";

import { TuitionPaymentProvider } from '@/contexts/TuitionPaymentContext';
import React from 'react';
import TuitionPaymentContainer from './components/TuitionPaymentContainer';

const Tuition = () => {
   return (
      <TuitionPaymentProvider>
         <div className="relative min-h-screen py-12 px-4 bg-[url('/payments/payment6.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/70 z-0"></div>
            <div className="max-w-4xl mx-auto relative z-10">
               <TuitionPaymentContainer />
            </div>
         </div>
      </TuitionPaymentProvider>
   );
};

export default Tuition;
