'use client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastProvider = () => {
   return <ToastContainer />;
};

export const notify = (data: { message: string; variant: "success" | "error" | "info" | "warning", timeout?: number }) => {
   const { message, variant, timeout } = data;

   toast[variant](message, {
      position: 'top-right',
      autoClose: timeout || 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
   });
};