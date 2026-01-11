"use client";

import { AcceptancePaymentProvider } from '@/contexts/AcceptancePaymentContext';
import React from 'react';
import AcceptancePaymentContainer from './components/AcceptancePaymentContainer';

const AcceptancePage = () => {
   return (
      <AcceptancePaymentProvider>
         <div className="relative min-h-screen py-12 px-4 bg-[url('/payments/payment8.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/70 z-0"></div>
            <div className="max-w-4xl mx-auto relative z-10">
               <AcceptancePaymentContainer />
            </div>
         </div>
      </AcceptancePaymentProvider>
   );
};

export default AcceptancePage;
