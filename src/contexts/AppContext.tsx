"use client";
import { ProgramType, Roles } from '@/config';
import { AdmissionStatusType, StatusType, UserInterface } from '@/config/Types';
import { ensureClient } from '@/lib/ensureClient';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AppState = {
   student: UserInterface;
   isAuthenticated: boolean;
   isPageLoading: boolean;
   activeProgramType?: ProgramType;
   isODL?: boolean;
   isUBS?: boolean;
};

type AppContextType = {
   state: AppState;
   setStudent: (newStudentData: Partial<UserInterface>) => void;
   getStudent: () => UserInterface;
   removeStudent: () => void;
   setActiveProgramType: (status: ProgramType) => void;
   setAuthentication: (status: boolean) => void;
   setIsPageLoading: (status: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type Props = {
   children: ReactNode;
};

export const AppProvider: React.FC<Props> = ({ children }) => {
   const [isClient, setIsClient] = useState(false);
   const [state, setState] = useState<AppState>({
      student: {
         id: null,
         pictureRef: null,
         last_name: null,
         first_name: null,
         other_name: null,
         username: null,
         gender: '',
         faculty_id: null,
         department_id: null,
         nationality: null,
         program: null,
         program_id: null,
         state: null,
         phone_number: null,
         email: null,
         password: null,
         reference: null,
         amount: null,
         reg_number: null,
         is_applied: 0,
         reason_for_denial: null,
         admission_status: AdmissionStatusType.PENDING,
         acceptance_fee_payment_status: StatusType.UNPAID,
         tuition_payment_status: StatusType.UNPAID,
         application_payment_status: StatusType.UNPAID,
         created_at: null,
         updated_at: null,
         deleted_at: null,
         role: Roles.STUDENT,
         level: null,
         tuition_amount_paid: 0,
      },
      isPageLoading: false,
      isAuthenticated: false,
      activeProgramType: ProgramType.ODL,
      isODL: false,
      isUBS: false,
   });

   useEffect(() => {
      try {
         ensureClient();
         setIsClient(true);
      } catch (error) {
         console.error(error);
      }
   }, []);

   useEffect(() => {
      if (state.activeProgramType === ProgramType.BUSINESS_SCHOOL) {
         setState((prev) => ({ ...prev, isUBS: true }));
      } else {
         setState((prev) => ({ ...prev, isUBS: false }));
      }
      if (state.activeProgramType === ProgramType.ODL) {
         setState((prev) => ({ ...prev, isODL: true }));
      } else {
         setState((prev) => ({ ...prev, isODL: false }));
      }
   }, [state.activeProgramType])

   // Function to update student
   const setStudent = (newStudentData: Partial<UserInterface>) => {
      if (isClient) {
         localStorage.setItem("student", JSON.stringify(newStudentData));
         setState((prevState) => ({
            ...prevState,
            student: { ...prevState.student, ...newStudentData },
         }));
      }
   };
   const getStudent = () => {
      if (isClient) {
         const student = localStorage.getItem("student") || "";
         return JSON.parse(student);
      }
   };
   const removeStudent = () => {
      if (isClient) {
         localStorage.removeItem("student");
      }
   };

   const setActiveProgramType = (value: ProgramType) => {
      setState((prev) => ({ ...prev, activeProgramType: value }));
   };

   const setAuthentication = (status: boolean) => {
      setState((prev) => ({ ...prev, isAuthenticated: status }));
   };

   const setIsPageLoading = (status: boolean) => {
      setState((prev) => ({ ...prev, isAuthenticated: status }));
   };

   return (
      <AppContext.Provider value={{
         state,
         setStudent,
         getStudent,
         removeStudent,
         setActiveProgramType,
         setAuthentication,
         setIsPageLoading,
      }}>
         {children}
      </AppContext.Provider>
   );
};

// Hook to use the AppContext
export const useAppContext = () => {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error('useAppContext must be used within AppProvider');
   }
   return context;
};
