"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

type AdmissionState = {
   accessToken: string;
   paymentRef: string;
   regNumber: string;
};

type AdmissionContextType = {
   state: AdmissionState;
   setAccessToken: (passportUrl: string) => void;
   setPaymentRef: (qaulificationUrl: string) => void;
   setRegNumber: (qaulificationUrl: string) => void;
};

const AdmissionContext = createContext<AdmissionContextType | undefined>(undefined);

type Props = {
   children: ReactNode;
};

export const AdmissionProvider: React.FC<Props> = ({ children }) => {
   const [state, setState] = useState<AdmissionState>({
      accessToken: "",
      paymentRef: "",
      regNumber: "",
   });

   const setAccessToken = (access_token: string) => {
      setState((prev) => ({ ...prev, access_token }));
   }

   const setPaymentRef = (paymentRef: string) => {
      setState((prev) => ({ ...prev, paymentRef }))
   }

   const setRegNumber = (regNumber: string) => {
      setState((prev) => ({ ...prev, regNumber }))
   }

   return (
      <AdmissionContext.Provider value={{
         state,
         setAccessToken,
         setPaymentRef,
         setRegNumber,
      }}>
         {children}
      </AdmissionContext.Provider>
   );
};

// Hook to use the AdmissionContext
export const useAdmissionContext = () => {
   const context = useContext(AdmissionContext);
   if (!context) {
      throw new Error('useAdmissionContext must be used within AppProvider');
   }
   return context;
};
