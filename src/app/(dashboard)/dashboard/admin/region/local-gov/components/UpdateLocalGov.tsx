"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm, } from "react-hook-form";
import { z } from 'zod';
import { Loader2 } from "lucide-react";
import { UpdateSingleLocalGov } from '@/app/actions/server.admin';
import { notify } from '@/contexts/ToastProvider';
import { baseUrl } from '@/config';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { InputFormField, SelectFormField } from '@/components/ui/inputs/FormFields';
import { extractErrorMessages } from '@/lib/errorsHandler';
import { LocalGov, State } from '@/config/Types';

const UpdateLocalGov = ({ access_token, localGov, states, }: { access_token: string, states: State[], localGov: LocalGov }) => {
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isValid, isSubmitting },
      control,
   } = useForm<UpdateLocalGovFormData>({
      resolver: zodResolver(UpdateStateSchema),
      defaultValues: {
         state_id: String(localGov?.state_id || ""),
         name: localGov?.name || ""
      }
   });
   const router = useRouter();

   useEffect(() => {
      if (localGov) {
         reset({
            state_id: String(localGov.state_id),
            name: localGov.name,
         });
      }
   }, [reset, localGov]);

   const onSubmit: SubmitHandler<UpdateLocalGovFormData> = async (data) => {
      const { error, success } = await UpdateSingleLocalGov(localGov.id, access_token, data);
      if (error) {
         const errorMessages = extractErrorMessages(error);
         errorMessages.forEach((msg) => {
            notify({ message: msg, variant: "error", timeout: 10000 });
         });
         return;
      }
      if (success) {
         notify({ message: 'State Update Data Successful.', variant: "success", timeout: 5000 })
         router.push(`${baseUrl}/dashboard/admin/region/local-gov`)
         router.refresh();
      }
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="grid col-auto text-gray-700 space-y-10 mx-auto p-10 md:p-16 bg-gray-200 w-full sm:w-3/4 md:w-3/4 lg:w-2/3">
            <h1 className="text-3xl font-bold mb-4">
               <span className="text-orange-700 font-extralight inline-block">{localGov.name}</span>
            </h1>
            <SelectFormField<UpdateLocalGovFormData>
               name="state_id"
               placeholder={"Select the State"}
               control={control}
               options={states.map((state) => ({ value: String(state.id), label: state.name }))}
               error={errors.state_id}
            />
            <InputFormField<UpdateLocalGovFormData>
               type="text"
               id={'name'}
               label="Name of Local Government"
               name="name"
               register={register}
               error={errors.name}
            />
            <div className="flex justify-center w-full">
               <Button
                  type='submit'
                  disabled={!isValid || isSubmitting}
               >
                  {isSubmitting
                     ? (
                        <>
                           <span>{"Updating data "}</span>
                           <Loader2 fontSize={20} size={40} className="animate-spin text-lg" />
                        </>
                     )
                     : <span>{"Update Local Gov"}</span>
                  }
               </Button>
            </div>
         </div>
      </form>
   )
}

export default UpdateLocalGov


export const UpdateStateSchema = z.object({
   name: z.string().min(3, "Name should be at least 3 characters"),
   state_id: z.string().min(1, "State is required"),
})
export type UpdateLocalGovFormData = z.infer<typeof UpdateStateSchema>;