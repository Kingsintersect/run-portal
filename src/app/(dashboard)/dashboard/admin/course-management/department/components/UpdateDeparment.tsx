"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { UpdateSingleDepartment } from '@/app/actions/server.admin';
import { notify } from '@/contexts/ToastProvider';
import { baseUrl } from '@/config';
import { useRouter } from 'next/navigation';
import { InputFormField, SelectFormField } from '@/components/ui/inputs/FormFields';
import { Button } from '@/components/ui/button';
import { extractErrorMessages } from '@/lib/errorsHandler';
import { Faculty, Department } from '@/config/Types';

const UpdateDeparment = ({ faculties, department, access_token }: { faculties: Faculty[], department: Department, access_token: string }) => {
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
      control,
   } = useForm<UpdateDeparmentFormData>({
      resolver: zodResolver(UpdateDeparmentSchema),
      defaultValues: {
         faculty_id: String(department?.faculty_id || ""),
         department_name: department?.department_name || ""
      }
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const router = useRouter();

   useEffect(() => {
      if (department) {
         reset({
            faculty_id: String(department.faculty_id),
            department_name: department.department_name,
         });
      }
   }, [department, reset]);

   const onSubmit: SubmitHandler<UpdateDeparmentFormData> = async (data) => {
      setIsLoading(true);
      try {
         const { error, success } = await UpdateSingleDepartment(department.id, access_token, data);
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
         <div className="grid col-auto text-gray-700 space-y-10 mx-auto p-10 md:p-16 bg-gray-200 w-full sm:w-3/4 md:w-3/4 lg:w-2/3">
            <h1 className="text-3xl font-bold mb-4">
               <span className="text-orange-700 font-extralight inline-block">{department.department_name}</span>
            </h1>
            <SelectFormField<UpdateDeparmentFormData>
               name="faculty_id"
               control={control}
               label="Select Faculty"
               options={faculties.map(faculty => ({ value: String(faculty.id), label: faculty.faculty_name }))}
               placeholder="Choose a faculty"
               error={errors.faculty_id}
            />
            <InputFormField<UpdateDeparmentFormData>
               type="text"
               id={'department_name'}
               label="Department Name"
               name="department_name"
               register={register}
               error={errors.department_name}
            />
            <div className="flex justify-center w-full">
               <Button type='submit'>
                  Edit Department
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

export default UpdateDeparment

export const UpdateDeparmentSchema = z
   .object({
      faculty_id: z.string().min(1, "Faculty is required"),
      department_name: z
         .string({ message: "Deprtment name is required" })
         .min(3, "Department name should be at least 3 characters"),
   })

type UpdateDeparmentFormData = z.infer<typeof UpdateDeparmentSchema>;