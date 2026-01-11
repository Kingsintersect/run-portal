"use client";

import { DeleteSingleCountry } from "@/app/actions/server.admin";
import { notify } from "@/contexts/ToastProvider";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { extractErrorMessages } from "@/lib/errorsHandler";

export const DeleteCountry = ({ access_token, id }: { access_token: string, id: string }) => {
   const router = useRouter();
   const handleCountryDelete = async (id: string) => {
      const { error, success }: any = await DeleteSingleCountry(access_token, id);
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
      }
   }

   return (
      <>
         <span className="" onClick={() => handleCountryDelete(id)}>
            <DropdownMenuItem>
               <TrashIcon className="w-5" />
               <span className="inline-block">Delete</span>
            </DropdownMenuItem>
         </span>
      </>
   )
}