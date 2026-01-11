"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import { Loader2 } from "lucide-react";
import { CreateNewLocalGov } from '@/app/actions/server.admin';
import { notify } from '@/contexts/ToastProvider';
import { baseUrl } from '@/config';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { InputFormField, SelectFormField } from '@/components/ui/inputs/FormFields';
import { extractErrorMessages } from '@/lib/errorsHandler';
import { State } from '@/config/Types';

const CreateLocalGov = ({ access_token, states }: { access_token: string, states: State[] }) => {
   const {
      register,
      handleSubmit,
      formState: { errors, isValid, isSubmitting },
      control,
   } = useForm<CreateLocalGovFormData>({ resolver: zodResolver(CreateStateSchema), });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const router = useRouter();

   const onSubmit: SubmitHandler<CreateLocalGovFormData> = async (data) => {
      setIsLoading(true);
      try {
         const { error, success } = await CreateNewLocalGov(access_token, data);
         if (error) {
            const errorMessages = extractErrorMessages(error);
            errorMessages.forEach((msg) => {
               notify({ message: msg, variant: "error", timeout: 10000 });
            });
            return;
         }
         if (success) {
            notify({ message: 'Create Data Successful.', variant: "success", timeout: 5000 })
            router.push(`${baseUrl}/dashboard/admin/region/local-gov`)
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
               Create <span className="text-orange-700 font-extralight inline-block">{"New Local Gov. Area"}</span>
            </h1>
            <SelectFormField<CreateLocalGovFormData>
               name="state_id"
               placeholder={"Select the State"}
               control={control}
               options={states.map((state) => ({ value: String(state.id), label: state.name }))}
               error={errors.state_id}
            />
            <InputFormField<CreateLocalGovFormData>
               type="text"
               id={'lga'}
               label="Local gov. area title"
               name="lga"
               register={register}
               error={errors.lga}
            />
            <div className="flex justify-center w-full">
               <Button
                  type='submit'
                  disabled={!isValid || isSubmitting}
               >
                  {isSubmitting
                     ? (
                        <>
                           <span>{"Saving data "}</span>
                           <Loader2 fontSize={20} size={40} className="animate-spin text-lg" />
                        </>
                     )
                     : <span>{"Save New Local Gov"}</span>
                  }
               </Button>
            </div>
         </div>
      </form>
   )
}

export default CreateLocalGov


export const CreateStateSchema = z.object({
   lga: z
      .string({ message: "Name is required" })
      .min(3, "Name should be at least 3 characters"),
   state_id: z.string().min(1, "State is required"),
})
export type CreateLocalGovFormData = z.infer<typeof CreateStateSchema>;

