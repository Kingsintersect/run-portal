"use client";

import { DeleteSingleFaculty } from "@/app/actions/server.admin";
import { notify } from "@/contexts/ToastProvider";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { extractErrorMessages } from "@/lib/errorsHandler";

export const DeleteFaculty = ({ access_token, id }: { access_token: string, id: string }) => {
   const router = useRouter();

   const handleFacultyDelete = async (id: string) => {
      const { error, success } = await DeleteSingleFaculty(access_token, id);
      if (error) {
         const errorMessages = extractErrorMessages(error);
         errorMessages.forEach((msg) => {
            notify({ message: msg, variant: "error", timeout: 10000 });
         });
         return;
      }
      if (success) {
         notify({ message: 'Deleted Successfully.', variant: "success", timeout: 5000 })
         router.refresh();
         hardReload();
      }

   }

   const hardReload = () => {
      window.location.reload();
   };
   return (
      <>
         <span className="" onClick={() => handleFacultyDelete(id)}>
            <DropdownMenuItem>
               <TrashIcon className="w-5" />
               <span className="inline-block">Delete</span>
            </DropdownMenuItem>
         </span>
      </>
   )
}