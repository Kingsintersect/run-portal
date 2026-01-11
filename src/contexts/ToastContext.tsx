"use client";
import React, { createContext, useState, ReactNode, useCallback, useContext } from 'react';

interface ToastContextProps {
   showToast: (toast: Toast, timeout?: number) => void;
}

interface Toast {
   description: string;
   variant?: 'success' | 'error' | 'info' | 'warning';
   title?: string;
   action?: HTMLElement;
}

export const ToastContext = createContext<ToastContextProps>({
   showToast: () => { },
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
   const [toast, setToast] = useState<Toast | null>(null);
   const [visible, setVisible] = useState(false);


   const showToast = useCallback((toast: Toast, timeout: number = 10000) => {
      setToast(toast);
      setVisible(true);
      setTimeout(() => {
         setVisible(false);
      }, timeout);
   }, []);

   return (
      <ToastContext.Provider value={{ showToast }}>
         {children}
         {toast && (
            <div
               className={`fixed top-4 right-5 z-50 transform transition-transform duration-500 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'
                  }`}
            >
               <div
                  className={`flex items-center p-4 rounded shadow-lg text-white ${toast.variant === 'success' ? 'bg-green-800' :
                     toast.variant === 'error' ? 'bg-red-800' :
                        toast.variant === 'info' ? 'bg-blue-800' :
                           toast.variant === 'warning' ? 'bg-yellow-800' :
                              'bg-gray-800'
                     }`}
               >
                  {/** Icon based on toast variant */}
                  <div className="mr-2">
                     {toast.variant === 'success' && (
                        <svg
                           className="w-6 h-6"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                           />
                        </svg>
                     )}
                     {toast.variant === 'error' && (
                        <svg
                           className="w-6 h-6"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                           />
                        </svg>
                     )}
                     {toast.variant === 'info' && (
                        <svg
                           className="w-6 h-6"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M12 18h.01"
                           />
                        </svg>
                     )}
                     {toast.variant === 'warning' && (
                        <svg
                           className="w-6 h-6"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01M7.938 4.938l4.264 7.427a1.5 1.5 0 002.596 0l4.264-7.427A1.5 1.5 0 0017.264 3H6.736a1.5 1.5 0 001.202 1.938z"
                           />
                        </svg>
                     )}
                  </div>
                  <div className='' style={{ width: "300px" }}>
                     <div className="text-base font-semibold">{toast.title}</div>
                     <p className="text-sm">{toast.description}</p>
                  </div>
               </div>
            </div>
         )}
      </ToastContext.Provider>
   );
};

// Hook to use the AppContext
export const useToast = () => {
   const context = useContext(ToastContext);
   if (!context) {
      throw new Error('useToastContext must be used within AppProvider');
   }
   return context;
};
