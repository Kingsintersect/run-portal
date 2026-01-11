"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import { ArrowRightIcon } from "lucide-react";
import { UpdateSingleCountry } from '@/app/actions/server.admin';
import { notify } from '@/contexts/ToastProvider';
import { baseUrl } from '@/config';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { InputFormField } from '@/components/ui/inputs/FormFields';
import { extractErrorMessages } from '@/lib/errorsHandler';
import { Country } from '@/config/Types';

const UpdateCountry = ({ country, access_token }: { country: Country, access_token: string }) => {
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<UpdateCountryFormData>({ resolver: zodResolver(UpdateDepartmentSchema), });
   const router = useRouter();

   useEffect(() => {
      if (country) {
         reset(country);  // Reset form with parent data
      }
   }, [country, reset]);

   const onSubmit: SubmitHandler<UpdateCountryFormData> = async (data) => {
      try {
         const { error, success }: any = await UpdateSingleCountry(access_token, data);
         if (error) {
            const errorMessages = extractErrorMessages(error);
            errorMessages.forEach((msg) => {
               notify({ message: msg, variant: "error", timeout: 10000 });
            });
            return;
         }
         if (success) {
            notify({ message: 'Update Data Successful.', variant: "success", timeout: 5000 })
            router.push(`${baseUrl}/dashboard/admin/region/countries`)
            router.refresh();
         }
      } catch (error) {
         console.error("An unexpected error occurred:", error);
      }
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="grid col-auto text-gray-700 space-y-10 mx-auto p-10 md:p-16 bg-gray-200 w-full sm:w-3/4 md:w-3/4 lg:w-2/3">
            <h1 className="text-3xl font-bold mb-4">
               Edit <span className="text-orange-700 font-extralight inline-block ml-10">{country.name}</span>
            </h1>
            <InputFormField<UpdateCountryFormData>
               type="text"
               id={'name'}
               label="Country Name"
               name="name"
               register={register}
               error={errors.name}
            />
            <div className="flex justify-center w-full">
               <Button type='submit'>
                  Update Country
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
               </Button>
            </div>
         </div>
      </form>
   )
}

export default UpdateCountry

export const UpdateDepartmentSchema = z.object({
   name: z
      .string({ message: "Country name is required" })
      .min(3, "Country name should be at least 3 characters"),
})
export type UpdateCountryFormData = z.infer<typeof UpdateDepartmentSchema>;