"use client";
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, CircleAlert, Loader, XCircle } from "lucide-react";
import { AdmissionStatusType, StatusType } from '@/config/Types';

export function AdmissionStatus({ admissionStatus }: { admissionStatus: AdmissionStatusType }) {
   const status = admissionStatusConfig[admissionStatus.toUpperCase()];

   if (!status || !status.icon) {
      return (
         <Card className="bg-gray-100">
            <CardContent>
               <div className="text-lg text-red-500 font-bold">Invalid Admission Status: {admissionStatus}</div>
            </CardContent>
         </Card>
      );
   }

   const Icon = status.icon;

   return (
      <Card className={status.backgroundColor}>
         <CardContent>
            <div className="grid grid-cols-1">
               <div className="text-lg mb-5 text-slate-500 font-bold">ADMISSION STATUS</div>
               <div className="flex items-center gap-3">
                  <Icon className={`h-14 w-14 ${status.iconColor}`} />
                  <span className={`${status.textColor} text-2xl`}>{status.message}</span>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}

export function StatusCheckCard({
   dataStatus,
   admission,
   title,
   url = "#",
   // flag,
}: {
   dataStatus: StatusType;
   admission: AdmissionStatusType;
   title: string;
   url?: string;
   // flag?: string;
}) {
   const statusKey = dataStatus as StatusType;

   const status = statusConfig[statusKey];

   if (status === undefined) {
      return (
         <Card className="bg-gray-100">
            <CardContent>
               <div className="p-4 text-center text-red-600 font-semibold">
                  Unknown status: {dataStatus}
               </div>
            </CardContent>
         </Card>
      );
   }

   const Icon = status.icon;
   const isLinkActive = admission === AdmissionStatusType.ADMITTED && statusKey !== StatusType.FULLY_PAID;

   return (
      <Card className={status.backgroundColor}>
         <CardContent>
            <Link href={isLinkActive ? url : "#"}>
               <div className="grid grid-cols-1">
                  <div className="text-lg mb-5 text-slate-500 font-bold">{title}</div>
                  <div className="flex items-center gap-3">
                     <Icon className={`h-14 w-14 ${status.iconColor}`} />
                     <span className={`${status.textColor} text-2xl`}>{status.message}</span>
                  </div>
               </div>
            </Link>
         </CardContent>
      </Card>
   );
}


const statusConfig = {
   [StatusType.FULLY_PAID]: {
      iconColor: "text-green-400 dark:text-green-200",
      textColor: "text-green-500",
      backgroundColor: "bg-[#e1fff4]",
      message: "Paid",
      icon: CheckCircle,
   },
   [StatusType.PART_PAID]: {
      iconColor: "text-lime-400 dark:text-lime-200",
      textColor: "text-lime-500",
      backgroundColor: "bg-lime-50",
      message: "PART PAID",
      icon: CheckCircle,
   },
   [StatusType.UNPAID]: {
      iconColor: "text-red-400 dark:text-red-200",
      textColor: "text-red-500",
      backgroundColor: "bg-[#fff4f4]",
      message: "Not Paid",
      icon: XCircle
   },
}

const admissionStatusConfig = {
   [AdmissionStatusType.ADMITTED]: {
      iconColor: "text-green-400 dark:text-green-200",
      textColor: "text-green-500",
      backgroundColor: "bg-[#e1fff4]",
      message: "GRANTED",
      icon: CheckCircle,
   },
   [AdmissionStatusType.PENDING]: {
      iconColor: "text-cyan-400 dark:text-cyan-200",
      textColor: "text-cyan-500",
      backgroundColor: "bg-[#e6f6f8]",
      message: "PENDING",
      icon: CircleAlert
   },
   [AdmissionStatusType.NOT_ADMITTED]: {
      iconColor: "text-red-400 dark:text-red-200",
      textColor: "text-red-500",
      backgroundColor: "bg-[#fff4f4]",
      message: "DENAIED",
      icon: XCircle
   },
   [AdmissionStatusType.INPROGRESS]: {
      iconColor: "text-blue-400 dark:text-blue-200",
      textColor: "text-blue-500",
      backgroundColor: "bg-blue-100",
      message: "INPROGRESS",
      icon: Loader
   }
};