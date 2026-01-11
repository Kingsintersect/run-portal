"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChangeUserPassword } from "@/app/actions/auth-actions";
import { notify } from "@/contexts/ToastProvider";
import { useRouter } from "next/navigation";
import { extractErrorMessages } from "@/lib/errorsHandler";
import { useAuth } from "@/contexts/AuthContext";
import { X, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

interface ChangePasswordProps {
   isOpen: boolean;
   onClose: () => void;
}

export const ChangePasswordSchema = z.object({
   current_password: z.string().min(1, "Current password is required"),
   new_password: z
      .string()
      .min(6, { message: "Your new password should be at least 6 characters long" }),
   confirm_password: z.string(),
})
   .refine((data) => data.new_password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
   });

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

export const ChangePasswordForm = ({ isOpen, onClose }: ChangePasswordProps) => {
   const router = useRouter();
   const { access_token } = useAuth();
   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
   const [errorMessage, setErrorMessage] = useState("");

   const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      reset
   } = useForm<ChangePasswordFormData>({
      resolver: zodResolver(ChangePasswordSchema),
      mode: "onChange"
   });

   if (!isOpen) return null;

   const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data, event?: React.BaseSyntheticEvent) => {
      event?.preventDefault();
      setStatus('submitting');

      if (!access_token) {
         setStatus('error');
         setErrorMessage('Token is missing. Please log in again.');
         notify({ message: 'Token is missing. Please log in again.', variant: "error", timeout: 10000 });
         return;
      }

      try {
         const { error, success } = await ChangeUserPassword(access_token, data);

         if (error) {
            setStatus('error');
            const errorMessages = extractErrorMessages(error);
            setErrorMessage(errorMessages[0] || "Failed to change password");
            errorMessages.forEach((msg) => {
               notify({ message: msg, variant: "error", timeout: 10000 });
            });
            return;
         }

         if (success) {
            setStatus('success');
            notify({ message: 'Password reset successful.', variant: "success", timeout: 5000 });

            // Reset form after successful submission
            reset();

            // Close modal after 2 seconds
            setTimeout(() => {
               onClose();
               router.refresh();
            }, 2000);
         }
      } catch (err) {
         setStatus('error');
         setErrorMessage("An unexpected error occurred");
         console.error(err);
      }
   };

   const togglePasswordVisibility = (field: string) => {
      if (field === 'current') setShowCurrentPassword(!showCurrentPassword);
      if (field === 'new') setShowNewPassword(!showNewPassword);
      if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
   };

   const handleClose = () => {
      setStatus('idle');
      setErrorMessage("");
      reset();
      onClose();
   };

   const PasswordInput = ({
      id,
      name,
      label,
      show,
      toggleShow,
      error,
   }: {
      id: string;
      name: "current_password" | "new_password" | "confirm_password";
      label: string;
      show: boolean;
      toggleShow: () => void;
      error?: { message?: string };
   }) => (
      <div className="mb-4">
         <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
         </label>
         <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
               <Lock className="h-5 w-5" />
            </div>
            <input
               type={show ? "text" : "password"}
               id={id}
               {...register(name)}
               className={`w-full pl-10 pr-10 py-3 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all`}
               placeholder={`Enter ${label.toLowerCase()}`}
               disabled={status === 'submitting' || status === 'success'}
            />
            <button
               type="button"
               onClick={toggleShow}
               className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
               {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
         </div>
         {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
      </div>
   );

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
         <div
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
         >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
               <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/20 transition-all"
               >
                  <X className="h-6 w-6" />
               </button>
               <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-lg mr-4">
                     <Lock className="h-6 w-6" />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold">Change Password</h2>
                     <p className="text-sm text-blue-100 mt-1">Update your password to keep your account secure</p>
                  </div>
               </div>
            </div>

            {/* Status Message */}
            {status === 'success' && (
               <div className="p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 mx-6 mt-6 rounded-lg flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-700 dark:text-green-400 font-medium">Password changed successfully!</span>
               </div>
            )}

            {status === 'error' && (
               <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 mx-6 mt-6 rounded-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 dark:text-red-400 font-medium">{errorMessage}</span>
               </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
               <PasswordInput
                  id="current_password"
                  name="current_password"
                  label="Current Password"
                  show={showCurrentPassword}
                  toggleShow={() => togglePasswordVisibility('current')}
                  error={errors.current_password}
               />

               <PasswordInput
                  id="new_password"
                  name="new_password"
                  label="New Password"
                  show={showNewPassword}
                  toggleShow={() => togglePasswordVisibility('new')}
                  error={errors.new_password}
               />

               <PasswordInput
                  id="confirm_password"
                  name="confirm_password"
                  label="Confirm New Password"
                  show={showConfirmPassword}
                  toggleShow={() => togglePasswordVisibility('confirm')}
                  error={errors.confirm_password}
               />

               {/* Password strength indicators could go here */}

               <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                  <button
                     type="button"
                     className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                     onClick={handleClose}
                     disabled={status === 'submitting' || status === 'success'}
                  >
                     Cancel
                  </button>

                  <button
                     type="submit"
                     disabled={!isValid || status === 'submitting' || status === 'success'}
                     className={`
                px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 min-w-32
                ${(isValid && status !== 'success')
                           ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                           : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
              `}
                  >
                     {status === 'submitting' ? (
                        <>
                           <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                           Changing...
                        </>
                     ) : (
                        "Change Password"
                     )}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};
