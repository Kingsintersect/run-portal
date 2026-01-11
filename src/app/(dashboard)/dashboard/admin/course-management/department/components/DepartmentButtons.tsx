"use client";

import { DeleteSingleDepartment } from "@/app/actions/server.admin";
import { notify } from "@/contexts/ToastProvider";
import { TrashIcon } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { extractErrorMessages } from "@/lib/errorsHandler";

export const DeleteDepartment = ({ access_token, id }: { access_token: string, id: string }) => {
   const router = useRouter();

   const handleDepartmentDelete = async (id: string) => {
      try {
         const { error, success } = await DeleteSingleDepartment(access_token, id);
         if (error) {
            const errorMessages = extractErrorMessages(error);
            errorMessages.forEach((msg) => {
               notify({ message: msg, variant: "error", timeout: 10000 });
            });
            return;
         }
         if (success) {
            notify({ message: 'Deleted Successfully.', variant: "success", timeout: 5000 });
            router.refresh();
            hardReload();
         }
      } catch (error) {
         console.error("Error fetching courses:", error);
      }
   }
   const hardReload = () => {
      window.location.reload();
   };

   return (
      <>
         <span className="" onClick={() => handleDepartmentDelete(id)}>
            <DropdownMenuItem>
               <TrashIcon className="w-5" />
               <span className="inline-block">Delete</span>
            </DropdownMenuItem>
         </span>
      </>
   )
}