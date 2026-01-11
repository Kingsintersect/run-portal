"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { PayAcceptanceFee } from "@/app/actions/student";
import { notify } from "@/contexts/ToastProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractErrorMessages } from "@/lib/errorsHandler";
import { PayAcceptanceFeeSchema, PayAcceptanceFormData } from "../PayAcceptanceFeeSchema";
import { InputFormField } from "@/components/ui/inputs/FormFields";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ACCEPTANCE_FEE } from "@/config"
import {
   Dialog,
   DialogContent,
   DialogTrigger,
} from "@/components/ui/dialog"


const AppPayAcceptanceFeeModal = ({ user, modalSize = "md" }: { user: any, modalSize?: string }) => {
   const router = useRouter();
   const [openModal, setOpenModal] = useState(false);
   const { access_token } = useAuth();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<PayAcceptanceFormData>({ resolver: zodResolver(PayAcceptanceFeeSchema), });

   const onSubmit: SubmitHandler<PayAcceptanceFormData> = async (data) => {
      if (access_token) {
         const { error, success } = await PayAcceptanceFee(access_token, { ...data })
         if (error) {
            const errorMessages = extractErrorMessages(error);
            errorMessages.forEach((msg) => {
               notify({ message: msg, variant: "error", timeout: 10000 });
            });
            return;
         }
         notify({ message: "Successfull", variant: "success", timeout: 5000 });
         setOpenModal(false);
         localStorage.setItem("acceptance_data", success.data);
         router.push(success.data.authorizationUrl);
         router.refresh();
         return;
      }
   }

   const handleOpenModal = useCallback((state: boolean) => setOpenModal(state), []);

   return (
      <>
         <Dialog>
            <DialogTrigger>
               <Button size="lg" className="bg-orange-800 text-white hover:bg-orange-600!important" onClick={() => handleOpenModal(true)}>Accept Admission</Button>
            </DialogTrigger>
            <DialogContent>
               <div className="text-center">
                  <div className="text-center w-full mb-1 text-orange-600 dark:text-orange-200 font-bold text-5xl" >
                     30,000
                  </div>
                  <h3 className="mb-10 text-lg font-normal text-gray-700">
                     Acceptance Fee
                  </h3>
                  <form onSubmit={handleSubmit(onSubmit)}>
                     <InputFormField<PayAcceptanceFormData>
                        type="hidden"
                        id={'amount'}
                        label={""}
                        name="amount"
                        register={register}
                        error={errors.amount}
                        valueAsNumber
                        value={ACCEPTANCE_FEE}
                     />
                     <div className="flex justify-center gap-4">
                        <Button color="gray" type="button" onClick={() => handleOpenModal(false)}>
                           No, cancel
                        </Button>
                        <Button color="success" type="submit">
                           {"Pay Acceptance"}
                        </Button>
                     </div>
                  </form>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}

export default AppPayAcceptanceFeeModal

