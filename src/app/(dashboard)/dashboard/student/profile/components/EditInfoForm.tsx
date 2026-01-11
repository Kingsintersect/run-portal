"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Phone, Save } from "lucide-react";
import { UserInterface } from "@/config/Types";
import { updateStudentPersonalInfoData } from "@/app/actions/applications";

// Props
interface StudentInfoProps {
   student: Partial<UserInterface>;
}
const schema = z.object({
   id: z.string().optional(),
   first_name: z.string().min(2, "Name must be at least 2 characters"),
   last_name: z.string().min(2, "Last name must be at least 2 characters").optional(),
   other_name: z.string().optional(),
   email: z.string().email("Invalid email format"),
   phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
});

type FormData = z.infer<typeof schema>;

const EditInfoForm = ({ student }: StudentInfoProps) => {
   const [isSaving, setIsSaving] = useState(false);
   const [successMessage, setSuccessMessage] = useState("");

   const {
      register,
      handleSubmit,
      formState: { errors, isDirty },
   } = useForm<FormData>({
      defaultValues: {
         id: student.id?.toString() || "",
         first_name: student.first_name ?? "",
         last_name: student.last_name ?? "",
         other_name: student.other_name ?? "",
         email: student.email ?? "",
         phone_number: student.phone_number ?? "",
      },
      resolver: zodResolver(schema),
   });

   const onSubmit = async (data: FormData) => {
      setIsSaving(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      await updateStudentPersonalInfoData({ id: student.id ? String(student.id) : undefined, ...data });

      console.log("Updated Info:", data);
      setSuccessMessage("Profile information updated successfully!");
      setIsSaving(false);

      // Clear success message after 5 seconds
      setTimeout(() => {
         setSuccessMessage("");
      }, 5000);
   };

   const InputField = ({
      name,
      label,
      type = "text",
      icon,
      placeholder,
      required = false
   }: {
      name: keyof FormData;
      label: string;
      type?: string;
      icon: React.ReactNode;
      placeholder?: string;
      required?: boolean;
   }) => (
      <div className="mb-5">
         <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
         </label>
         <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
               {icon}
            </div>
            <input
               type={type}
               id={name}
               {...register(name)}
               className={`w-full pl-10 pr-3 py-2 border ${errors[name] ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors`}
               placeholder={placeholder || label}
            />
         </div>
         {errors[name] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[name]?.message as string}</p>
         )}
      </div>
   );

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         {successMessage && (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
               <div className="rounded-full bg-green-200 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
               </div>
               {successMessage}
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField
               name="first_name"
               label="First Name"
               icon={<User className="h-5 w-5" />}
               placeholder="Enter your first name"
               required
            />

            <InputField
               name="last_name"
               label="Last Name"
               icon={<User className="h-5 w-5" />}
               placeholder="Enter your last name"
               required
            />
         </div>
         <InputField
            name="other_name"
            label="Other Name"
            icon={<User className="h-5 w-5" />}
            placeholder="Enter your last name"
            required
         />

         <InputField
            name="email"
            label="Email Address"
            type="email"
            icon={<Mail className="h-5 w-5" />}
            placeholder="your.email@university.edu"
            required
         />

         <InputField
            name="phone_number"
            label="Phone Number"
            type="tel"
            icon={<Phone className="h-5 w-5" />}
            placeholder="+1 (234) 567-8910"
            required
         />


         <div className="flex justify-end">
            <button
               type="submit"
               disabled={isSaving || !isDirty}
               className={`
            flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium shadow-md
            ${isDirty
                     ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                     : 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'}
            transition-all duration-200
          `}
            >
               {isSaving ? (
                  <>
                     <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-white"></div>
                     Saving...
                  </>
               ) : (
                  <>
                     <Save className="h-5 w-5" />
                     Save Changes
                  </>
               )}
            </button>
         </div>
      </form>
   );
};

export default EditInfoForm;
