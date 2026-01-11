"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { CreateNewDepartment } from '@/app/actions/server.admin';
import { notify } from '@/contexts/ToastProvider';
import { baseUrl } from '@/config';
import { useRouter } from 'next/navigation';
import { InputFormField, SelectFormField } from '@/components/ui/inputs/FormFields';
import { Button } from '@/components/ui/button';
import { extractErrorMessages } from '@/lib/errorsHandler';
import { Faculty } from '@/config/Types';

const CreateDeparment = ({ faculties, access_token }: { faculties: Faculty[], access_token: string }) => {
   const {
      register,
      handleSubmit,
      formState: { errors },
      control,
   } = useForm<DeparmentFormData>({ resolver: zodResolver(CreateDepartmentSchema), });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const router = useRouter();

   const onSubmit: SubmitHandler<DeparmentFormData> = async (data) => {
      setIsLoading(true);
      const { error, success } = await CreateNewDepartment(access_token, data);
      try {
         if (error) {
            const errorMessages = extractErrorMessages(error);
            errorMessages.forEach((msg) => {
               notify({ message: msg, variant: "error", timeout: 10000 });
            });
            return;
         }
         if (success) {
            notify({ message: 'Update Data Successful.', variant: "success", timeout: 5000 })
            router.push(`${baseUrl}/dashboard/admin/course-management/department`)
            router.refresh();
         }
      } catch (error) {
         console.error("An unexpected error occurred:", error);
      } finally {
         setIsLoading(false);
      }
   }


   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="grid col-auto text-gray-700 space-y-5 mx-auto p-10 md:p-16 bg-gray-200 w-full sm:w-3/4 md:w-3/4 lg:w-2/3">
            <h1 className="text-3xl font-bold mb-4">
               Create <span className="text-orange-700 font-extralight inline-block">{"New Department"}</span>
            </h1>
            <SelectFormField<DeparmentFormData>
               name="faculty_id"
               control={control}
               label="Select Faculty"
               options={faculties.map(faculty => ({ value: String(faculty.id), label: faculty.faculty_name }))}
               placeholder="Choose a faculty"
               error={errors.faculty_id}
            />
            <InputFormField<DeparmentFormData>
               type="text"
               id={'department_name'}
               label="Department Name"
               name="department_name"
               register={register}
               error={errors.department_name}
            />

            <div className="flex justify-center w-full">
               <Button type='submit'>
                  Save New Department
                  {
                     (isLoading)
                        ? (<Loader2 className="animate-spin" />)
                        : (<ArrowRightIcon className="ml-2 h-5 w-5" />)
                  }
               </Button>
            </div>
         </div>
      </form>
   )
}

export default CreateDeparment

export const CreateDepartmentSchema = z
   .object({
      faculty_id: z.string().min(1, "Faculty is required"),
      department_name: z
         .string({ message: "Title is required" })
         .min(3, "Title should be at least 3 characters"),
   })

type DeparmentFormData = z.infer<typeof CreateDepartmentSchema>;
