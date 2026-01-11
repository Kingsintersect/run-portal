"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { CreateNewCountry } from '@/app/actions/server.admin';
import { notify } from '@/contexts/ToastProvider';
import { baseUrl } from '@/config';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { InputFormField } from '@/components/ui/inputs/FormFields';
import { extractErrorMessages } from '@/lib/errorsHandler';

const CreateCountry = ({ access_token }: { access_token: string }) => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<CreateCountryFormData>({ resolver: zodResolver(CreateDepartmentSchema), });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const router = useRouter();

   const onSubmit: SubmitHandler<CreateCountryFormData> = async (data) => {
      setIsLoading(true);
      try {
         const { error, success }: any = await CreateNewCountry(access_token, data);
         if (error) {
            const errorMessages = extractErrorMessages(error);
            errorMessages.forEach((msg) => {
               notify({ message: msg, variant: "error", timeout: 10000 });
            });
            return;
         }
         if (success) {
            notify({ message: 'Create Data Successful.', variant: "success", timeout: 5000 })
            router.push(`${baseUrl}/dashboard/admin/region/countries`)
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
               Create <span className="text-orange-700 font-extralight inline-block ml-10">{"New Country"}</span>
            </h1>
            <InputFormField<CreateCountryFormData>
               type="text"
               id={'name'}
               label="Country Name"
               name="name"
               register={register}
               error={errors.name}
            />
            <div className="flex justify-center w-full">
               <Button type='submit'>
                  Save New Country
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

export default CreateCountry



export const CreateDepartmentSchema = z.object({
   name: z
      .string({ message: "Country name is required" })
      .min(3, "Country name should be at least 3 characters"),
})
export type CreateCountryFormData = z.infer<typeof CreateDepartmentSchema>;
