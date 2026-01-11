"use client";

import { RejectStudentAdmission } from "@/app/actions/admin";
import { baseUrl } from "@/config";
import { useAuth } from "@/contexts/AuthContext";
import { notify } from "@/contexts/ToastProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ObjectType } from '@/types/generic.types';

const RejectStudentAdmissionModal = ({ modalSize, id }: { modalSize: string, id: any }) => {
   const router = useRouter();
   const methods = useForm();
   const [openModal, setOpenModal] = useState(false);
   const { access_token } = useAuth();
   const { handleSubmit } = methods;

   const onSubmit = async (data: ObjectType) => {
      setOpenModal(false)
      if (access_token) {
         const { error, success } = await RejectStudentAdmission(access_token, { ...data, application_id: id });
         if (error) {
            console.log('errors', error.message);
            notify({ message: "Something went wrong", variant: "error", timeout: 5000 });
         }
         if (success) {
            notify({ message: "Successfull", variant: "success", timeout: 5000 });
            router.push(`${baseUrl}/dashboard/admin/users/student-applications`);
            router.refresh();
         }
      } else {
         router.push(`${baseUrl}/auth/signin`);
         router.refresh();
      }
   }

   const handleOpenModal = (state: boolean) => {
      setOpenModal(state)
   }

   return (
      <>

         <Dialog>
            <DialogTrigger>
               <div className="flex flex-wrap gap-4">
                  <Button color={"failure"} onClick={() => handleOpenModal(true)}>Reject Admission</Button>
               </div>
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <div className="font-semibold text-3xl">Confirm Admission Rejection</div>
               </DialogHeader>
               <div className="space-y-6 p-6">
                  <div className="mb-2 block">
                     <Label htmlFor="reason" className="text-xl text-red-400 font-bold">State your reason/reasons for rejection...</Label>
                  </div>
                  <Textarea id="reason" placeholder="Leave a reason..." {...methods.register('reason')} rows={4} />
               </div>
               <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                     <Button type="button" variant="secondary">
                        Close
                     </Button>
                  </DialogClose>
                  <Button color={"failure"} type="submit" >Reject</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
}

export default RejectStudentAdmissionModal

